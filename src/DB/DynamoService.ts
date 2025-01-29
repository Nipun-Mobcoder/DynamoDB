import AWS from "aws-sdk";
import { IAwsDynamoClientFactory } from "./AwsDynamoClientFactory";
import { IAwsDynamoDBConfig } from "@src/config/aws/DynamoDBConfig";

export interface IDynamoDBService {
  getDynamoClient(): AWS.DynamoDB;
  getDocClient(): AWS.DynamoDB.DocumentClient;
}

class DynamoDBService implements IDynamoDBService {
  private dynamoClient: AWS.DynamoDB | null = null;
  private docClient: AWS.DynamoDB.DocumentClient | null = null;

  constructor(
    private awsDynamoClientFactory: IAwsDynamoClientFactory,
    private config: IAwsDynamoDBConfig,
  ) {}

  private initializeDynamoClient(): AWS.DynamoDB {
    if (!this.dynamoClient) {
      this.dynamoClient = this.awsDynamoClientFactory.createDynamoClient(this.config);
    }
    return this.dynamoClient;
  }

  private initializeDocClient(): AWS.DynamoDB.DocumentClient {
    if (!this.docClient) {
      this.docClient = this.awsDynamoClientFactory.createDocClient(this.config);
    }
    return this.docClient;
  }

  getDynamoClient(): AWS.DynamoDB {
    try {
      return this.initializeDynamoClient();
    } catch (error) {
      console.error("Error initializing DynamoDB client:", error);
      throw new Error("Failed to get DynamoDB client");
    }
  }

  getDocClient(): AWS.DynamoDB.DocumentClient {
    try {
      return this.initializeDocClient();
    } catch (error) {
      console.error("Error initializing DynamoDB DocumentClient:", error);
      throw new Error("Failed to get DynamoDB DocumentClient");
    }
  }
}

export default DynamoDBService;
