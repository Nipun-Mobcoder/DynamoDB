export interface IUser {
  name: string | null;
  email: string;
  password: string;
  team_id?: string;
}

export interface ModelUser {
  email: string;
  password: string;
  team_id: number;
  name: string | null;
}
