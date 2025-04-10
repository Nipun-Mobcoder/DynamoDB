import express, { RequestHandler } from "express";
import AwsConfig from "@src/config/aws/AWSConfig";
import configuration from "@src/config";
import DynamoDBService from "@src/DB/DynamoService";
import AwsDynamoClientFactory from "@src/DB/AwsDynamoClientFactory";
import { TeamRepository } from "@src/repositories/TeamsRepository";
import { TeamsService } from "@src/service/TeamService";
import { TeamController } from "@src/controller/TeamController";

const router = express.Router();
const config = configuration.aws;
const awsConfig = new AwsConfig(
  config.region,
  config.accessKeyId,
  config.secretAccessKey,
  config.accountId,
  config.sqsName,
);
const awsDynamoClientFactory = new AwsDynamoClientFactory();
const awsDynamoClientService = new DynamoDBService(awsDynamoClientFactory, awsConfig);
const teamRepository = new TeamRepository(awsDynamoClientService);
const teamService = new TeamsService(teamRepository);
const teamController = new TeamController(teamService);

router.route("/create").post(teamController.create as RequestHandler);
router.route("/fetch").get(teamController.fetchTeams as RequestHandler);

export default router;
