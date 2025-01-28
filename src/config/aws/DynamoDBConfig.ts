export interface IAwsDynamoDBConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

class AwsDynamoDBConfig implements IAwsDynamoDBConfig {
  public region;
  public accessKeyId;
  public secretAccessKey;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }
}

export default AwsDynamoDBConfig;
