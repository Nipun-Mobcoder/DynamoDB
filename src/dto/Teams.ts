export enum status {
  "To Do",
  "In Progress",
  "Review",
  "Completed",
}

export enum priority {
  "Severe",
  "High",
  "Medium",
  "Low",
}

export interface ITeams {
  team_members?: String[];
  board_name?: string;
  task_title?: string;
  task_description?: string;
  task_status?: status;
  priority?: priority;
  task_due_date?: Date;
}

export interface ModelTeam extends ITeams {
  team_id: string;
  item_type: string;
  created_at: string;
}
