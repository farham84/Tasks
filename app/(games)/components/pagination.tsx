"use client";

import React, { useCallback } from 'react';
import GameCard from "./gameCard";
import { Game } from './types';


interface GameListSectionProps {
  loading: boolean;
  games: Game[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GameListSection({ 
  loading, 
  games, 
  currentPage, 
  totalPages, 
  onPageChange 
}: GameListSectionProps) {
  
  // توابع کمکی برای تغییر صفحه
  const goToPrevPage = useCallback(() => {
    onPageChange(Math.max(1, currentPage - 1));
  }, [currentPage, onPageChange]);

  const goToNextPage = useCallback(() => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  }, [currentPage, totalPages, onPageChange]);

  return (
    <main className="max-w-7xl mx-auto">
      {loading ? (
        // اسکلتون لودینگ
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-slate-800/50 animate-pulse h-80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-8 text-slate-400 flex items-center gap-2">
             <span className="w-8 h-[2px] bg-purple-500"></span>
             لیست کل بازی‌ها
          </h2>
          
          {/* لیست بازی‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-20 pb-10">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-8 py-3 bg-slate-800 hover:bg-purple-600 disabled:opacity-30 rounded-xl transition-all font-bold text-sm border border-white/5"
              >
                قبلی
              </button>
              <span className="text-slate-400 font-mono">
                صفحه <span className="text-white font-bold">{currentPage}</span> از {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-8 py-3 bg-slate-800 hover:bg-purple-600 disabled:opacity-30 rounded-xl transition-all font-bold text-sm border border-white/5"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
