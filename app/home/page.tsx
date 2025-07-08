"use client"

import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

// ShadCN Card
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// ShadeCN Mode Toggle (for light/dark/system)
import { ModeToggle } from "@/components/mode-toggle"

// Show/Hide History animation
import { motion, AnimatePresence } from "framer-motion";

// ShadCN MenuBar
import {
  Menubar,
  // NOTE: The following imports are currently unused. Uncomment if you need them in the future.
  // MenubarContent,
  // MenubarItem,
  // MenubarMenu,
  // MenubarSeparator,
  // MenubarShortcut,
  // MenubarTrigger,
} from "@/components/ui/menubar"

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
}

export default function Game() {
  const router = useRouter();
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(true); // ✅ now inside component
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function toggleHistory() {
    setShowHistory(prev => !prev);
  }

  async function handleLogout() {
    try {
      const result = await signOut();
      if (result.success) {
        router.push('/login');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start:';
    return (
      <li key={move} style={{ display: 'inline-block', marginBottom: '10px', width: move === 0 ? '100%' : '32%' }}>
        <button
          onClick={() => jumpTo(move)}
          className={`px-3 py-1 rounded text-sm transition ${
            move === 0
              ? 'bg-muted hover:bg-muted/80'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen gap-5 p-5">
        <Menubar
          className="fixed top-0 left-0 z-50 flex items-center gap-4 px-4 py-2 rounded-none rounded-br-md 
                    bg-background text-foreground shadow-sm border border-border"
        >
          <span className="font-semibold text-lg italic cursor-default select-none">
            TicTacToe
          </span>

          <div className="h-5 w-px bg-border" />

          <span
            onClick={toggleHistory}
            className="text-sm cursor-pointer text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-[1.05] select-none"
          >
            {showHistory ? "Hide History" : "Show History"}
          </span>

          <div className="h-5 w-px bg-border" />

          <ModeToggle />

          <div className="h-5 w-px bg-border" />

          <span
            onClick={handleLogout}
            className="text-sm cursor-pointer text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-[1.05] select-none"
          >
            Logout
          </span>
        </Menubar>

      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <AnimatePresence mode="wait">
        {showHistory && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full max-w-[600px]"
          >
            <Card className="w-full max-w-[600px] transition-all duration-500 ease-in-out hover:shadow-lg">
              <CardHeader>
                <CardTitle>Game History</CardTitle>
                <CardDescription>View and jump to previous moves:</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="moves-list" style={{
                  paddingLeft: "20px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2%",
                  margin: 0
                }}>
                  {moves}
                </ol>
            </CardContent>
            </Card>
          </motion.div>
        )}
        </AnimatePresence>
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
