export interface Profile {
  id?: number;
  user_id: string;
  username: string;
  created_at?: string;
  updated_at?: string;
  theme: string;
  games_won: number;
  games_lost: number;
  games_drawn: number;
} 