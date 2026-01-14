"use client";

import { useState, useEffect } from "react";
import { useTodaysBracket, useSubmitBracket } from "@/hooks/useBracket";
import { useRouter } from "next/navigation";
import { OFFLINE_MODE } from "@/lib/offline-config";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { toast } from "sonner";

type Item = {
  id: string;
  color: string;
  name: string;
};

const ItemBox = ({
  item,
  onClick,
  onUndo,
  showUndo = false,
}: {
  item: Item | null;
  onClick?: () => void;
  onUndo?: () => void;
  showUndo?: boolean;
}) => {
  const content = (
    <div
      className={`relative h-16 w-32 rounded-lg group ${
        item ? item.color : "bg-transparent-background"
      }  transition-all flex items-center justify-center p-2 cursor-pointer `}
      onClick={onClick}
    >
      {item ? (
        <span className="line-clamp-3 text-center text-[0.825rem] font-semibold leading-tight text-white">
          {item.name}
        </span>
      ) : (
        ""
      )}
      {showUndo && item && onUndo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
          className="absolute top-1 right-1 w-5 h-5 hover:bg-transparent-button-hover bg-transparent-button text-black rounded-full flex items-center justify-center font-bold cursor-pointer text-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );

  if (!item) {
    return content;
  }

  return (
    <TooltipPrimitive.Root delayDuration={1750}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={2}>
        <p>{item.name}</p>
      </TooltipContent>
    </TooltipPrimitive.Root>
  );
};

export default function Home() {
  const router = useRouter();
  const { data: bracketData, isLoading, error } = useTodaysBracket();
  const submitMutation = useSubmitBracket();

  // Color palette for items
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-600",
    "bg-lime-600",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-rose-500",
  ];

  // Transform API data to include colors
  const round1: Item[] =
    bracketData?.items.map((item, index) => ({
      id: item.id,
      name: item.name,
      color: colors[index % colors.length],
    })) || [];

  const [round2, setRound2] = useState<(Item | null)[]>(Array(8).fill(null));
  const [round3, setRound3] = useState<(Item | null)[]>(Array(4).fill(null));
  const [round4, setRound4] = useState<(Item | null)[]>(Array(2).fill(null));
  const [champion, setChampion] = useState<Item | null>(null);

  // Show offline mode toast on every page load
  useEffect(() => {
    if (OFFLINE_MODE) {
      // Small delay to ensure Toaster is mounted on initial page load
      const timer = setTimeout(() => {
        toast.info(
          'Hey! This app is currently using offline local data while I migrate services. Real data and history will be available again soon! Click the "Offline" button to learn more. - Alex ❤️',
          { duration: 8000 }
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = () => {
    if (!champion) return;

    submitMutation.mutate(
      { winnerId: champion.id },
      {
        onSuccess: () => {
          router.push("/results");
        },
        onError: (error) => {
          console.error("Failed to submit bracket:", error);
          // Still redirect to results if already voted (429)
          if (error.message.includes("already submitted")) {
            router.push("/results");
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-white">Loading today&apos;s bracket...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-white">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load bracket"}
      </div>
    );
  }

  if (round1.length === 0) {
    return <div className="p-8 text-white">No bracket available today</div>;
  }

  const handleItemClick = (item: Item, round: number, matchupIndex: number) => {
    if (round === 1) {
      const newRound2 = [...round2];
      newRound2[matchupIndex] = item;
      setRound2(newRound2);
    } else if (round === 2) {
      if (!round2.every((i) => i !== null)) {
        toast.info("Complete the previous round first!");
        return;
      }
      const newRound3 = [...round3];
      newRound3[matchupIndex] = item;
      setRound3(newRound3);
    } else if (round === 3) {
      if (!round3.every((i) => i !== null)) {
        toast.info("Complete the previous round first!");
        return;
      }
      const newRound4 = [...round4];
      newRound4[matchupIndex] = item;
      setRound4(newRound4);
    } else if (round === 4) {
      if (!round4.every((i) => i !== null)) {
        toast.info("Complete the previous round first!");
        return;
      }
      setChampion(item);
    }
  };

  const handleUndo = (round: number, index: number) => {
    if (round === 2) {
      const newRound2 = [...round2];
      newRound2[index] = null;
      setRound2(newRound2);
      clearSubsequentRounds(2, index);
    } else if (round === 3) {
      const newRound3 = [...round3];
      newRound3[index] = null;
      setRound3(newRound3);
      clearSubsequentRounds(3, index);
    } else if (round === 4) {
      const newRound4 = [...round4];
      newRound4[index] = null;
      setRound4(newRound4);
      setChampion(null);
    } else if (round === 5) {
      setChampion(null);
    }
  };

  const clearSubsequentRounds = (round: number, index: number) => {
    if (round === 2) {
      const round3Index = Math.floor(index / 2);
      const newRound3 = [...round3];
      newRound3[round3Index] = null;
      setRound3(newRound3);

      const round4Index = Math.floor(round3Index / 2);
      const newRound4 = [...round4];
      newRound4[round4Index] = null;
      setRound4(newRound4);

      setChampion(null);
    } else if (round === 3) {
      const round4Index = Math.floor(index / 2);
      const newRound4 = [...round4];
      newRound4[round4Index] = null;
      setRound4(newRound4);

      setChampion(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full overflow-x-auto p-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4 min-w-max mx-auto w-fit">
            {/* Round 1 Left - 8 teams, 4 matchups */}
            <div className="relative flex flex-col justify-around h-[675px]">
              {[0, 1, 2, 3].map((matchup) => (
                <div key={matchup} className="flex flex-col gap-2">
                  <ItemBox
                    item={round1[matchup * 2]}
                    onClick={() =>
                      handleItemClick(round1[matchup * 2], 1, matchup)
                    }
                  />
                  <ItemBox
                    item={round1[matchup * 2 + 1]}
                    onClick={() =>
                      handleItemClick(round1[matchup * 2 + 1], 1, matchup)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Round 2 Left - 4 teams */}
            <div className="relative flex flex-col justify-around h-[675px]">
              {[0, 1].map((matchup) => (
                <div key={matchup} className="flex flex-col gap-2">
                  <ItemBox
                    item={round2[matchup * 2]}
                    onClick={() =>
                      round2[matchup * 2] &&
                      handleItemClick(round2[matchup * 2]!, 2, matchup)
                    }
                    onUndo={() => handleUndo(2, matchup * 2)}
                    showUndo={true}
                  />
                  <ItemBox
                    item={round2[matchup * 2 + 1]}
                    onClick={() =>
                      round2[matchup * 2 + 1] &&
                      handleItemClick(round2[matchup * 2 + 1]!, 2, matchup)
                    }
                    onUndo={() => handleUndo(2, matchup * 2 + 1)}
                    showUndo={true}
                  />
                </div>
              ))}
            </div>

            {/* Round 3 Left - 2 teams */}
            <div className="relative flex flex-col justify-around h-[675px]">
              <div className="flex flex-col gap-2">
                <ItemBox
                  item={round3[0]}
                  onClick={() => round3[0] && handleItemClick(round3[0], 3, 0)}
                  onUndo={() => handleUndo(3, 0)}
                  showUndo={true}
                />
                <ItemBox
                  item={round3[1]}
                  onClick={() => round3[1] && handleItemClick(round3[1], 3, 0)}
                  onUndo={() => handleUndo(3, 1)}
                  showUndo={true}
                />
              </div>
            </div>

            {/* Finals Left - 1 team */}
            <div className="relative flex flex-col justify-center h-[675px]">
              <ItemBox
                item={round4[0]}
                onClick={() => round4[0] && handleItemClick(round4[0], 4, 0)}
                onUndo={() => handleUndo(4, 0)}
                showUndo={true}
              />
            </div>

            {/* Champion - center */}
            <div className="relative flex flex-col justify-center h-[675px]">
              <ItemBox
                item={champion}
                onUndo={() => handleUndo(5, 0)}
                showUndo={true}
              />
            </div>

            {/* Finals Right - 1 team */}
            <div className="relative flex flex-col justify-center h-[675px]">
              <ItemBox
                item={round4[1]}
                onClick={() => round4[1] && handleItemClick(round4[1], 4, 0)}
                onUndo={() => handleUndo(4, 1)}
                showUndo={true}
              />
            </div>

            {/* RIGHT SIDE */}

            {/* Round 3 Right - 2 teams */}
            <div className="relative flex flex-col justify-around h-[675px]">
              <div className="flex flex-col gap-2">
                <ItemBox
                  item={round3[2]}
                  onClick={() => round3[2] && handleItemClick(round3[2], 3, 1)}
                  onUndo={() => handleUndo(3, 2)}
                  showUndo={true}
                />
                <ItemBox
                  item={round3[3]}
                  onClick={() => round3[3] && handleItemClick(round3[3], 3, 1)}
                  onUndo={() => handleUndo(3, 3)}
                  showUndo={true}
                />
              </div>
            </div>

            {/* Round 2 Right - 4 teams */}
            <div className="relative flex flex-col justify-around h-[675px]">
              {[2, 3].map((matchup) => (
                <div key={matchup} className="flex flex-col gap-2">
                  <ItemBox
                    item={round2[matchup * 2]}
                    onClick={() =>
                      round2[matchup * 2] &&
                      handleItemClick(round2[matchup * 2]!, 2, matchup)
                    }
                    onUndo={() => handleUndo(2, matchup * 2)}
                    showUndo={true}
                  />
                  <ItemBox
                    item={round2[matchup * 2 + 1]}
                    onClick={() =>
                      round2[matchup * 2 + 1] &&
                      handleItemClick(round2[matchup * 2 + 1]!, 2, matchup)
                    }
                    onUndo={() => handleUndo(2, matchup * 2 + 1)}
                    showUndo={true}
                  />
                </div>
              ))}
            </div>

            {/* Round 1 Right - 8 teams, 4 matchups */}
            <div className="relative flex flex-col justify-around h-[675px]">
              {[4, 5, 6, 7].map((matchup) => (
                <div key={matchup} className="flex flex-col gap-2">
                  <ItemBox
                    item={round1[matchup * 2]}
                    onClick={() =>
                      handleItemClick(round1[matchup * 2], 1, matchup)
                    }
                  />
                  <ItemBox
                    item={round1[matchup * 2 + 1]}
                    onClick={() =>
                      handleItemClick(round1[matchup * 2 + 1], 1, matchup)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {champion && (
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold rounded-lg transition-colors"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Bracket"}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
