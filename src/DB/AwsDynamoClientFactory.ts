import AWS from "aws-sdk";
import { IAwsDynamoDBConfig } from "@src/config/aws/DynamoDBConfig";

export interface IAwsDynamoClientFactory {
  createDynamoClient(config: IAwsDynamoDBConfig): AWS.DynamoDB;
  createDocClient(config: IAwsDynamoDBConfig): AWS.DynamoDB.DocumentClient;
}

class AwsDynamoClientFactory implements IAwsDynamoClientFactory {
  createDynamoClient(config: IAwsDynamoDBConfig): AWS.DynamoDB {
    return new AWS.DynamoDB({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  createDocClient(config: IAwsDynamoDBConfig): AWS.DynamoDB.DocumentClient {
    return new AWS.DynamoDB.DocumentClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
}

export default AwsDynamoClientFactory;
