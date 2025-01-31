import { IAwsConfig } from "@src/config/aws/AWSConfig";
import { SQSClient } from "@aws-sdk/client-sqs";

export interface IAwsSQSClientFactory {
  createSQSClient(config: IAwsConfig): SQSClient;
}

class AwsSQSClientFactory implements IAwsSQSClientFactory {
  createSQSClient(config: IAwsConfig): SQSClient {
    return new SQSClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
}

export default AwsSQSClientFactory;
