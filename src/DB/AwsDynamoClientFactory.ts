import AWS from "aws-sdk";
import { IAwsConfig } from "@src/config/aws/AWSConfig";

export interface IAwsDynamoClientFactory {
  createDynamoClient(config: IAwsConfig): AWS.DynamoDB;
  createDocClient(config: IAwsConfig): AWS.DynamoDB.DocumentClient;
}

class AwsDynamoClientFactory implements IAwsDynamoClientFactory {
  createDynamoClient(config: IAwsConfig): AWS.DynamoDB {
    return new AWS.DynamoDB({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  createDocClient(config: IAwsConfig): AWS.DynamoDB.DocumentClient {
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
