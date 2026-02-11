"use client"

import { useEffect, useState } from "react";
import GameCard from "./gameCard";
import { Game } from "./types";

export default function TopWeak() {
    const [topGames, setTopGames] = useState<Game[]>([]);

    useEffect(() => { 
        const getTopGames = async () => {
          try {
            // فراخوانی API داخلی خودمان که قبلاً در route.ts درست کردیم
            const response = await fetch('/api/games?page_size=4&ordering=-rating');
            const data = await response.json();
            setTopGames(data.results);
          } catch (error) {
            console.error("Error fetching top games:", error);
          }
        };

        getTopGames();
      }, []);

    return (
        <>
         {topGames.length > 0 && (
        <section className="max-w-7xl mx-auto mb-20">
           <div className="flex items-center gap-4 mb-10">
              <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
              <h2 className="text-3xl font-bold tracking-tight text-white"> برترین‌های هفته🔥</h2>
           </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topGames.map((game) => (
              <GameCard key={`top-${game.id}`} game={game} isFeatured={true} />
            ))}
          </div>
        </section>
      )}
        </>
    )
}