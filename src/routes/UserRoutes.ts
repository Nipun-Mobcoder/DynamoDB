import express, { RequestHandler } from "express";
import { UserController } from "@src/controller/UserController";
import { UserService } from "@src/service/UserService";
import { UserRepository } from "@src/repositories/UserRepositries";
import AwsDynamoDBConfig from "@src/config/aws/DynamoDBConfig";
import configuration from "@src/config";
import DynamoDBService from "@src/DB/DynamoService";
import AwsDynamoClientFactory from "@src/DB/AwsDynamoClientFactory";

const router = express.Router();
const config = configuration.amazonDynamo;
const awsDynamoConfig = new AwsDynamoDBConfig(config.region, config.accessKeyId, config.secretAccessKey);
const awsDynamoClientFactory = new AwsDynamoClientFactory();
const awsClientFactory = new DynamoDBService(awsDynamoClientFactory, awsDynamoConfig);
const userRepository = new UserRepository(awsClientFactory);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.route("/register").post(userController.createUser as RequestHandler);
router.route("/login").post(userController.login as RequestHandler);
router.route("/profile").get(userController.profile as RequestHandler);

export default router;
