"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  //
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <h1
        className="text-2xl font-bold text-white cursor-pointer"
        onClick={() => router.push("/")}
      >
        Random Bracket
      </h1>
      <nav>
        <span
          className="text-zinc-300 hover:text-white transition-colors font-medium cursor-pointer"
          onClick={() => router.push("/results")}
        >
          Results
        </span>
      </nav>
    </header>
  );
}
