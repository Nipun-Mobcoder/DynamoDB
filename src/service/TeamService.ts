import { ITeams, ModelTeam } from "@src/dto/Teams";
import { ITeamsRepository } from "@src/repositories/TeamsRepository";
import { v4 as uuidv4 } from "uuid";

export interface ITeamsService {
  create(data: ModelTeam, type: string): Promise<Record<string, any> | null>;
  fetchTeams(team_id: string): Promise<Record<string, any> | null>;
}

export class TeamsService implements ITeamsService {
  private teamsRepository: ITeamsRepository;

  constructor(teamsRepository: ITeamsRepository) {
    this.teamsRepository = teamsRepository;
  }

  create = async (data: ITeams, type: string): Promise<Record<string, any> | null> => {
    try {
      const team_id = uuidv4();
      const created_at = new Date().toISOString();
      if (type === "Task") {
        const { team_members } = data;
        var item_type = "Team details";
        return await this.teamsRepository.createTeam({ team_members, team_id, item_type, created_at });
      } else {
        var item_type = "Task details";
        return await this.teamsRepository.createTask({
          team_id,
          item_type,
          created_at,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchTeams = async (team_id: string): Promise<Record<string, any> | null> => {
    try {
      const teamData = await this.teamsRepository.fetchTeams(team_id);
      return teamData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };
}
