import jwt from "jsonwebtoken";
import { IUser, ModelUser } from "@src/dto/User";
import { IDynamoDBService } from "@src/DB/DynamoService";

export interface IUserRepository {
  findUser(email: string): Promise<Record<string, any> | null>;
  create(data: IUser): Promise<Record<string, any> | null>;
  createToken(data: Record<string, any> | null): string;
  fetchDetails(token: string): ModelUser;
}

export class UserRepository implements IUserRepository {

  private dynamoDB: IDynamoDBService;

  constructor(dynamoDB: IDynamoDBService) {
    this.dynamoDB = dynamoDB;
  }

  findUser = async (email: string): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: 'Users',
        Key: {
          email,
        },
      };
      const docClient = this.dynamoDB.getDocClient();
      const findUser = await docClient.get(params).promise();
      
      return findUser;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new Error(error.message || "Something went wrong while fetching the user.");
      }
      throw new Error("An unexpected error occurred.");
    }
  }

  create = async (data: IUser): Promise<Record<string, any> | null> => {
    try {
      const params = {
        TableName: 'Users',
        Item: data,
      };
      const docClient = this.dynamoDB.getDocClient();
      const newUser = await docClient.put(
        params
      );
      return newUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  createToken = (user: Record<string, any> | null): string => {
    try {
      if(!user) throw new Error("Values are invalid.")
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "", { expiresIn: "1h" });

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
