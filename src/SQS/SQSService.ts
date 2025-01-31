import { IAwsSQSClientFactory } from "./AwsSQSClientFactory";
import { IAwsConfig } from "@src/config/aws/AWSConfig";
import { SQSClient } from "@aws-sdk/client-sqs";

export interface ISQSService {
  getSQSClient(): SQSClient;
  getSQSURL(): string;
}

class SQSService implements ISQSService {
  private sqsClient: SQSClient | null = null;

  constructor(
    private awsDynamoClientFactory: IAwsSQSClientFactory,
    private config: IAwsConfig,
  ) {}

  private initializeSQSClient(): SQSClient {
    if (!this.sqsClient) {
      this.sqsClient = this.awsDynamoClientFactory.createSQSClient(this.config);
    }
    return this.sqsClient;
  }

  getSQSClient(): SQSClient {
    try {
      return this.initializeSQSClient();
    } catch (error) {
      console.error("Error initializing DynamoDB client:", error);
      throw new Error("Failed to get DynamoDB client");
    }
  }

  getSQSURL(): string {
      return `https://sqs.${this.config.region}.amazonaws.com/${this.config.accountId}/${this.config.sqsName}`
  }
}

export default SQSService;
