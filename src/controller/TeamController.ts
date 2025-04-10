import { Request, Response } from "express";
import { ITeamsService } from "@src/service/TeamService";
import { logger } from "@src/utils/logging";

export interface ITeamController {
  create(req: Request, res: Response): Promise<void>;
}

export class TeamController implements ITeamController {
  private teamService: ITeamsService;

  constructor(teamService: ITeamsService) {
    this.teamService = teamService;
  }

  create = async (req: Request, res: Response) => {
    const { team_id, item_type, created_at, type } = req.body;

    try {
      const teamData = await this.teamService.create({ team_id, item_type, created_at }, type);
      res.status(200).json({
        success: true,
        message: `Team ${team_id} created successfully`,
        teamData,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error?.message || "Internal server error",
          error,
        });
      }
    }
  };

  fetchTeams = async (req: Request, res: Response) => {
    const { team_id } = req.query;
    if (!team_id) {
      res.status(500).json({
        success: false,
        message: "Please provide with team id.",
      });
      return;
    }
    try {
      const teamData = await this.teamService.fetchTeams(team_id.toString());
      res.status(200).json({
        success: true,
        message: "Team data fetched successfully.",
        teamData,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error?.message || "Internal server error",
          error,
        });
      }
    }
  };
}
