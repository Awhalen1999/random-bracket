"use client";

import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CountdownTimer from "./countdown-timer";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <h1
        className="text-2xl font-bold text-white cursor-pointer"
        onClick={() => router.push("/")}
      >
        Random Bracket
      </h1>

      <div className="absolute left-1/2 -translate-x-1/2">
        <CountdownTimer />
      </div>

      <nav className="flex items-center gap-6">
        <span
          className="text-zinc-300 hover:text-white transition-colors font-medium cursor-pointer"
          onClick={() => router.push("/results")}
        >
          Results
        </span>

        <Dialog>
          <DialogTrigger asChild>
            <button className="text-zinc-300 hover:text-white transition-colors">
              <HelpCircle size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader className="mb-2">
              <DialogTitle>RANDOM BRACKET</DialogTitle>
              <DialogDescription>
                Learn about Random Bracket and how to play
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm text-zinc-300">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  About the Game
                </h3>
                <p>
                  Every day, 16 completely random items / things are chosen to
                  compete in a tournament-style bracket. Pick the winner from
                  each matchup until you crown a champion! Don&apos;t overthink
                  it, just pick the winner based on your gut feeling.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">How to Play</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click on an item to advance it to the next round</li>
                  <li>Use the × button to undo your selection</li>
                  <li>Complete all rounds to pick your champion</li>
                  <li>Submit your bracket and see the others results</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Hover over items to see the undo × button</li>
                  <li>Hover over items for 1 second to see full names</li>
                  <li>Check the Results page to see how others voted</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
