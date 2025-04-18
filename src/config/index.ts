import "dotenv/config";

interface IConfig {
  application: {
    port: number;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    accountId: string;
    sqsName: string;
  };
}

class Config implements IConfig {
  public application: {
    port: number;
  };
  public aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    accountId: string;
    sqsName: string;
  };

  constructor() {
    this.application = {
      port: this.getNumber("PORT", 8080),
    };

    this.aws = {
      accessKeyId: this.getString("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.getString("AWS_SECRET_ACCESS_KEY"),
      region: this.getString("AWS_REGION"),
      accountId: this.getString("ACCOUNT_ID"),
      sqsName: this.getString("SQS_NAME"),
    };
  }

  private getNumber(envVal: string, defaultValue?: number): number {
    const value = process.env[envVal];
    if (value) return parseInt(value, 10);
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${envVal} not defined in environment.`);
  }

  private getString(envVal: string, defaultValue?: string): string {
    const value = process.env[envVal];
    if (value) return value;
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${envVal} not defined in environment.`);
  }
}

const configuration = new Config();
export default configuration;
