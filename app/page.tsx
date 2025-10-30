"use client";

import { useState } from "react";

type Team = {
  id: number;
  color: string;
  name: string;
};

const TeamBox = ({
  team,
  onClick,
  onUndo,
  showUndo = false,
}: {
  team: Team | null;
  onClick?: () => void;
  onUndo?: () => void;
  showUndo?: boolean;
}) => (
  <div
    className={`relative h-14 w-32 rounded-lg  ${
      team ? team.color : "bg-gray-100"
    } ${
      onClick ? "cursor-pointer" : ""
    } transition-all flex items-center justify-center text-white font-semibold text-sm`}
    onClick={onClick}
  >
    {team ? team.name : ""}
    {showUndo && team && onUndo && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUndo();
        }}
        className="absolute top-1 right-1 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-200"
      >
        ×
      </button>
    )}
  </div>
);

export default function Home() {
  const initialTeams: Team[] = [
    { id: 1, color: "bg-red-500", name: "Team 1" },
    { id: 2, color: "bg-blue-500", name: "Team 2" },
    { id: 3, color: "bg-green-500", name: "Team 3" },
    { id: 4, color: "bg-yellow-500", name: "Team 4" },
    { id: 5, color: "bg-purple-500", name: "Team 5" },
    { id: 6, color: "bg-pink-500", name: "Team 6" },
    { id: 7, color: "bg-indigo-500", name: "Team 7" },
    { id: 8, color: "bg-orange-500", name: "Team 8" },
    { id: 9, color: "bg-teal-500", name: "Team 9" },
    { id: 10, color: "bg-cyan-500", name: "Team 10" },
    { id: 11, color: "bg-lime-500", name: "Team 11" },
    { id: 12, color: "bg-amber-500", name: "Team 12" },
    { id: 13, color: "bg-emerald-500", name: "Team 13" },
    { id: 14, color: "bg-violet-500", name: "Team 14" },
    { id: 15, color: "bg-fuchsia-500", name: "Team 15" },
    { id: 16, color: "bg-rose-500", name: "Team 16" },
  ];

  const [round1] = useState<Team[]>(initialTeams);
  const [round2, setRound2] = useState<(Team | null)[]>(Array(8).fill(null));
  const [round3, setRound3] = useState<(Team | null)[]>(Array(4).fill(null));
  const [round4, setRound4] = useState<(Team | null)[]>(Array(2).fill(null));
  const [champion, setChampion] = useState<Team | null>(null);

  const handleTeamClick = (team: Team, round: number, matchupIndex: number) => {
    if (round === 1) {
      const newRound2 = [...round2];
      newRound2[matchupIndex] = team;
      setRound2(newRound2);
    } else if (round === 2) {
      if (!round2.every((t) => t !== null)) return;
      const newRound3 = [...round3];
      newRound3[matchupIndex] = team;
      setRound3(newRound3);
    } else if (round === 3) {
      if (!round3.every((t) => t !== null)) return;
      const newRound4 = [...round4];
      newRound4[matchupIndex] = team;
      setRound4(newRound4);
    } else if (round === 4) {
      if (!round4.every((t) => t !== null)) return;
      setChampion(team);
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
    <div className="min-h-screen bg-zinc-900 overflow-x-auto">
      <div className="flex justify-center items-center gap-4">
        {/* Round 1 Left - 8 teams, 4 matchups */}
        <div className="relative flex flex-col justify-around h-[600px]">
          {[0, 1, 2, 3].map((matchup) => (
            <div key={matchup} className="flex flex-col gap-2">
              <TeamBox
                team={round1[matchup * 2]}
                onClick={() => handleTeamClick(round1[matchup * 2], 1, matchup)}
              />
              <TeamBox
                team={round1[matchup * 2 + 1]}
                onClick={() =>
                  handleTeamClick(round1[matchup * 2 + 1], 1, matchup)
                }
              />
            </div>
          ))}
        </div>

        {/* Round 2 Left - 4 teams */}
        <div className="relative flex flex-col justify-around h-[600px]">
          {[0, 1].map((matchup) => (
            <div key={matchup} className="flex flex-col gap-2">
              <TeamBox
                team={round2[matchup * 2]}
                onClick={() =>
                  round2[matchup * 2] &&
                  handleTeamClick(round2[matchup * 2]!, 2, matchup)
                }
                onUndo={() => handleUndo(2, matchup * 2)}
                showUndo={true}
              />
              <TeamBox
                team={round2[matchup * 2 + 1]}
                onClick={() =>
                  round2[matchup * 2 + 1] &&
                  handleTeamClick(round2[matchup * 2 + 1]!, 2, matchup)
                }
                onUndo={() => handleUndo(2, matchup * 2 + 1)}
                showUndo={true}
              />
            </div>
          ))}
        </div>

        {/* Round 3 Left - 2 teams */}
        <div className="relative flex flex-col justify-around h-[600px]">
          <div className="flex flex-col gap-2">
            <TeamBox
              team={round3[0]}
              onClick={() => round3[0] && handleTeamClick(round3[0], 3, 0)}
              onUndo={() => handleUndo(3, 0)}
              showUndo={true}
            />
            <TeamBox
              team={round3[1]}
              onClick={() => round3[1] && handleTeamClick(round3[1], 3, 0)}
              onUndo={() => handleUndo(3, 1)}
              showUndo={true}
            />
          </div>
        </div>

        {/* Finals Left - 1 team */}
        <div className="relative flex flex-col justify-center h-[600px]">
          <TeamBox
            team={round4[0]}
            onClick={() => round4[0] && handleTeamClick(round4[0], 4, 0)}
            onUndo={() => handleUndo(4, 0)}
            showUndo={true}
          />
        </div>

        {/* Champion - center */}
        <div className="relative flex flex-col justify-center h-[600px]">
          <TeamBox
            team={champion}
            onUndo={() => handleUndo(5, 0)}
            showUndo={true}
          />
        </div>

        {/* Finals Right - 1 team */}
        <div className="relative flex flex-col justify-center h-[600px]">
          <TeamBox
            team={round4[1]}
            onClick={() => round4[1] && handleTeamClick(round4[1], 4, 0)}
            onUndo={() => handleUndo(4, 1)}
            showUndo={true}
          />
        </div>

        {/* RIGHT SIDE */}

        {/* Round 3 Right - 2 teams */}
        <div className="relative flex flex-col justify-around h-[600px]">
          <div className="flex flex-col gap-2">
            <TeamBox
              team={round3[2]}
              onClick={() => round3[2] && handleTeamClick(round3[2], 3, 1)}
              onUndo={() => handleUndo(3, 2)}
              showUndo={true}
            />
            <TeamBox
              team={round3[3]}
              onClick={() => round3[3] && handleTeamClick(round3[3], 3, 1)}
              onUndo={() => handleUndo(3, 3)}
              showUndo={true}
            />
          </div>
        </div>

        {/* Round 2 Right - 4 teams */}
        <div className="relative flex flex-col justify-around h-[600px]">
          {[2, 3].map((matchup) => (
            <div key={matchup} className="flex flex-col gap-2">
              <TeamBox
                team={round2[matchup * 2]}
                onClick={() =>
                  round2[matchup * 2] &&
                  handleTeamClick(round2[matchup * 2]!, 2, matchup)
                }
                onUndo={() => handleUndo(2, matchup * 2)}
                showUndo={true}
              />
              <TeamBox
                team={round2[matchup * 2 + 1]}
                onClick={() =>
                  round2[matchup * 2 + 1] &&
                  handleTeamClick(round2[matchup * 2 + 1]!, 2, matchup)
                }
                onUndo={() => handleUndo(2, matchup * 2 + 1)}
                showUndo={true}
              />
            </div>
          ))}
        </div>

        {/* Round 1 Right - 8 teams, 4 matchups */}
        <div className="relative flex flex-col justify-around h-[600px]">
          {[4, 5, 6, 7].map((matchup) => (
            <div key={matchup} className="flex flex-col gap-2">
              <TeamBox
                team={round1[matchup * 2]}
                onClick={() => handleTeamClick(round1[matchup * 2], 1, matchup)}
              />
              <TeamBox
                team={round1[matchup * 2 + 1]}
                onClick={() =>
                  handleTeamClick(round1[matchup * 2 + 1], 1, matchup)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
