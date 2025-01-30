import jwt from "jsonwebtoken";
import { IUser, ModelUser } from "@src/dto/User";
import { IDynamoDBService } from "@src/DB/DynamoService";
import { logger } from "@src/utils/logging";
import { AWSError } from "aws-sdk";

export interface IUserRepository {
  findUser(email: string): Promise<IUser|null>;
  create(data: IUser): Promise<Record<string, any> | null>;
  createToken(data: IUser): string;
  fetchDetails(token: string): ModelUser;
}

export class UserRepository implements IUserRepository {
  private dynamoDB: IDynamoDBService;

  constructor(dynamoDB: IDynamoDBService) {
    this.dynamoDB = dynamoDB;
  }

  createTable = async (partitionKey: string): Promise<Record<string, any> | undefined> => {
    const params = {
      TableName: "Users",
      KeySchema: [{ AttributeName: partitionKey, KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: partitionKey, AttributeType: "S" }],
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

  findUser = async (email: string): Promise<IUser | null> => {
    try {
      const params = {
        TableName: "Users",
        Key: {
          email,
        },
      };
      let fetchData = null;
      try {
        const docClient = await this.dynamoDB.getDocClient();
        fetchData = await docClient.get(params).promise();
      } catch (error) {
        const awsError = error as AWSError;
        if (awsError.code === "ResourceNotFoundException") {
          logger.warn(`Table 'Users' not found. Creating table...`);
          await this.createTable("email");
          logger.info("Table created. Retrying user fetch...");
          throw new Error("User not found.");
        }
        throw new Error("User not found.");
      }

      return fetchData?.Item as IUser || null;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);

        throw new Error("User not found.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  create = async (data: IUser): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: "Users",
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

  createToken = (user: IUser): string => {
    try {
      if (!user) throw new Error("Values are invalid.");
      const token = jwt.sign({ email: user.email, team_id: user.team_id || "" }, process.env.JWT_SECRET || "", { expiresIn: "1h" });

      return token;
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
