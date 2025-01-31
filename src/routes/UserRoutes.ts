import express, { RequestHandler } from "express";
import { UserController } from "@src/controller/UserController";
import { UserService } from "@src/service/UserService";
import { UserRepository } from "@src/repositories/UserRepositries";
import AwsConfig from "@src/config/aws/AWSConfig";
import configuration from "@src/config";
import DynamoDBService from "@src/DB/DynamoService";
import AwsDynamoClientFactory from "@src/DB/AwsDynamoClientFactory";
import AwsSQSClientFactory from "@src/SQS/AwsSQSClientFactory";
import SQSService from "@src/SQS/SQSService";

const router = express.Router();
const config = configuration.aws;
const awsConfig = new AwsConfig(config.region, config.accessKeyId, config.secretAccessKey, config.accountId, config.sqsName);
const awsDynamoClientFactory = new AwsDynamoClientFactory();
const awsSQSClientFactory = new AwsSQSClientFactory();
const awsDynamoClientService = new DynamoDBService(awsDynamoClientFactory, awsConfig);
const awsSQSClientService = new SQSService(awsSQSClientFactory, awsConfig);
const userRepository = new UserRepository(awsDynamoClientService, awsSQSClientService);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.route("/register").post(userController.createUser as RequestHandler);
router.route("/login").post(userController.login as RequestHandler);
router.route("/profile").get(userController.profile as RequestHandler);

export default router;
