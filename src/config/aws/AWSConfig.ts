export interface IAwsConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  accountId: string; 
  sqsName: string;
}

class AwsConfig implements IAwsConfig {
  public region;
  public accessKeyId;
  public secretAccessKey;
  public accountId; 
  public sqsName;

  constructor(region: string, accessKeyId: string, secretAccessKey: string, accountId: string, sqsName: string) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.accountId = accountId;
    this.sqsName = sqsName;
  }
}

export default AwsConfig;
