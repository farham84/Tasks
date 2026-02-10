"use client";

import Link from "next/link";

import Image from "next/image"; 
import { GameCardType } from "./types";



const GameCard = ({ game, isFeatured = false }: { game: GameCardType; isFeatured?: boolean }) => {
  
  const displayRatingsCount = game.ratings_count 
    ? `${game.ratings_count} بازدید` 
    : "امتیازی ثبت نشده";

  return (
    <div className={`group relative bg-slate-800/40 rounded-[2.5rem] overflow-hidden border transition-all duration-500 shadow-2xl 
      ${isFeatured ? 'border-purple-500/40 scale-100 hover:scale-[1.02]' : 'border-white/5 hover:border-blue-500/50'}`}>
      
      <div className="relative h-64 overflow-hidden">
        
        <Image 
          src={game.background_image || "/placeholder.jpg"} 
          alt={game.name} 
          fill 
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-110" 
          sizes="(max-width: 768px) 100vw, 50vw" 
          loading={isFeatured ? "eager" : "lazy"} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />
        <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl z-10">
          <span className="text-yellow-400 font-black text-xs">⭐ {game.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-7 relative -mt-8">
        <h3 className={`font-black text-white mb-3 line-clamp-1 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
          {game.name}
        </h3>
        
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-6 font-bold uppercase tracking-tighter">
         
          <span>{displayRatingsCount}</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
          
          <span>{game.genres[0]?.name || "بدون ژانر"}</span>
        </div>

        <Link href={`/games/${game.id}`} passHref legacyBehavior>
          
          <a className="w-full py-4 bg-slate-700/50 hover:bg-purple-600 rounded-2xl font-bold transition-all border border-white/5 hover:border-purple-400 flex items-center justify-center gap-2 group/btn cursor-pointer">
            مشاهده جزئیات
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
