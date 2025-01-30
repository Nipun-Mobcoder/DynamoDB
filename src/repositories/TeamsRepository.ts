import jwt from "jsonwebtoken";
import { ModelUser } from "@src/dto/User";
import { IDynamoDBService } from "@src/DB/DynamoService";
import { logger } from "@src/utils/logging";
import { AWSError } from "aws-sdk";
import { ModelTeam } from "@src/dto/Teams";

export interface ITeamsRepository {
  fetchTeams(team_id: string): Promise<Record<string, any> | null>;
  createTeam(data: ModelTeam): Promise<Record<string, any> | null>;
  createTask(data: ModelTeam): Promise<Record<string, any> | null>;
  fetchDetails(token: string): ModelUser;
}

export class TeamRepository implements ITeamsRepository {
  private dynamoDB: IDynamoDBService;

  constructor(dynamoDB: IDynamoDBService) {
    this.dynamoDB = dynamoDB;
  }

  createTable = async (partitionKey: string, sortKey: string): Promise<Record<string, any> | undefined> => {
    const params = {
      TableName: "Teams",
      KeySchema: [
        {
          AttributeName: partitionKey,
          KeyType: "HASH",
        },
        {
          AttributeName: sortKey,
          KeyType: "RANGE",
        },
      ],
      AttributeDefinitions: [
        { AttributeName: partitionKey, AttributeType: "S" },
        { AttributeName: sortKey, AttributeType: "S" },
      ],
      GlobalSecondaryIndex: [{
        IndexName: "BoardNameIndex",
        KeySchema: [
          { AttributeName: "board_name", KeyType: "HASH" },
          { AttributeName: "task_name", KeyType: "RANGE" }
        ],
        Projection: {
          ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        } 
      }],
      LocalSecondaryIndex: [{
        IndexName: "TaskNameIndex",
        KeySchema: [
          { AttributeName: "team_id", KeyType: "HASH" },
          { AttributeName: "task_name", KeyType: "RANGE" }
        ],
        Projection: {
          ProjectionType: "ALL"
        }
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    try {
      const dynamoDB = this.dynamoDB.getDynamoClient();
      const data = await dynamoDB.createTable(params).promise();
      console.log("Table created successfully:", data);
      return data;
    } catch (err) {
      console.error("Error creating table:", err);
      throw new Error("Error creating table.");
    }
  };

  fetchTeams = async (team_id: string): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: "Teams",
        Key: {
          team_id,
        },
      };
      let fetchData = null;
      try {
        const docClient = await this.dynamoDB.getDocClient();
        fetchData = await docClient.query(params).promise();
      } catch (error) {
        const awsError = error as AWSError;
        if (awsError.code === "ResourceNotFoundException") {
          logger.warn(`Table 'Users' not found. Creating table...`);
          await this.createTable("team_id", "created_at");
          logger.info("Table created. Retrying user fetch...");
          return {
            message: "Table Created Successfully. As there was no table with this following name.",
          };
        }
        throw new Error("User not found.");
      }

      return fetchData?.Items || null;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);

        throw new Error("User not found.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  createTeam = async (data: ModelTeam): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: "Teams",
        Item: data,
      };

      const docClient = await this.dynamoDB.getDocClient();
      await docClient.put(params).promise();
      return data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  createTask = async (data: ModelTeam): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: "Teams",
        Item: data,
      };
      const docClient = await this.dynamoDB.getDocClient();
      await docClient.put(params).promise();
      return data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchDetails = (token: string): ModelUser => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "") as ModelUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };
}
