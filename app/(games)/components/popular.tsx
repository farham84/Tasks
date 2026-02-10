"use client"

import { fetchGames } from "@/app/api/games/route";
import { useEffect, useState } from "react";
import GameCard from "./gameCard";
import { Game } from "./types";


export default function TopPopular() {
  const [popularGames, setPopularGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames({ page_size: 4, ordering: "-added" }).then((data) => {
      setPopularGames(data.results);
    });
  }, []);

  return (
    <>
      {popularGames.length > 0 && (
        <section className="max-w-7xl mx-auto mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-3xl font-bold tracking-tight text-white">پر بازدیدترین‌ها🔥</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularGames.map((game) => (
              <GameCard key={`popular-${game.id}`} game={game} isFeatured={true} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
