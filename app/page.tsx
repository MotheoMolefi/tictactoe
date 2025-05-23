"use client"

import { use, useState } from "react";

// ShadCN Card
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// ShadCN MenuBar
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"


// ShadCN Button
import { Button } from "@/components/ui/button"



interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      onClick={onSquareClick}
      className="w-15 h-15 text-xl font-bold flex items-center justify-center border border-border rounded-md transition-shadow duration-300 hover:shadow-xl"
    >
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (squares: (string | null)[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    // If square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Create copy of squares array (immutablility)
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    }
    else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X': 'O');
  }
  
  // Tic-Tac-Toe Board (ShadCN Card)
  return (
    <Card className="w-full max-w-[400px] mx-auto flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
      <CardHeader style={{ width: '100%', textAlign: 'center' }}>
        <CardTitle>Tic-Tac-Toe</CardTitle>
        <CardDescription>Connect three to win!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-lg font-medium">{status}</div>

        <div className="grid grid-cols-3 gap-2">
          {squares.map((value, index) => (
            <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Menubar (ShadCN Component)
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to game start:';
    }
    return (
      <li key={move} style={{ 
        display: 'inline-block',
        marginBottom: '10px',
        width: move === 0 ? '100%' : '32%'
      }}>
        <button 
          onClick={() => jumpTo(move)}
          className={`px-3 py-1 rounded text-sm transition ${
            move === 0
              ? 'bg-muted hover:bg-muted/80'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          >{description}
          

        </button>
      </li>
    );
  });
  
  // Game History (ShadCN Card)
  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: '20px',
      gap: '20px'
    }}>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <Card style={{ width: '100%', maxWidth: '600px' }}
            className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Game History</CardTitle>
          <CardDescription>View and jump to previous moves:</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="moves-list" style={{ 
            paddingLeft: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2%',
            margin: 0
          }}>{moves}</ol>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
