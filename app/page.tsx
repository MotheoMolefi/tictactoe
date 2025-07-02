"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold text-center text-foreground mb-4">Welcome to TicTacToe</h1>
        <p className="text-center text-muted-foreground mb-8">Please log in or sign up to continue.</p>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/login" className="w-full">
            <Button className="w-full text-lg">Log In</Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full text-lg">Sign Up</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 