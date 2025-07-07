export interface Move {
  user_id: string;
  order: number;
  position: string; // e.g., 'a1', 'b2', 'c3', etc.
  marker: 'X' | 'O';
}

export interface WinningMoveSequence {
  order: number;
  position: string; // e.g., 'a1', 'b2', 'c3', etc.
}

export interface Game {
  id: number;
  host: string;
  guest: string;
  created_at: string;
  updated_at: string;
  moves: Move[];
  winner: string;
  winning_move_sequence: WinningMoveSequence[];
} 