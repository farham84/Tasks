"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GameDetails } from "../../components/types";




type Screenshot = {
  id: number;
  image: string;
};

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const API_KEY = "15c7641dff154a93b46efb7ec93caaa6"; 

    async function fetchFullData() {
      try {
        const gameRes = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        const gameData = await gameRes.json();
        setGame(gameData);

        const screenRes = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`);
        const screenData = await screenRes.json();
        setScreenshots(screenData.results);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchFullData();
  }, [id]);

  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-t-4 border-pink-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
      </div>
      <span className="text-purple-400 font-bold tracking-[0.3em] animate-pulse">LOADING WORLD</span>
    </div>
  );

  if (!game) return <div className="min-h-screen bg-black text-white flex items-center justify-center">بازی پیدا نشد!</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-purple-500/40 selection:text-white pb-20 overflow-x-hidden">
      
     
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Fullscreen" 
              className="w-full h-full object-contain rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.3)]"
            />
            <button className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <p className="text-center text-slate-400 mt-4 text-sm tracking-widest uppercase">Click anywhere to close</p>
          </div>
        </div>
      )}

      
      <div className="fixed inset-0 z-0">
        <img 
          src={game.background_image_additional || game.background_image} 
          alt={game.name}
          
          className="w-full h-full object-cover scale-105 blur-[px] opacity-60 brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-90" />
      </div>

      
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-end pb-10 pt-32">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full">
          
          
          <div className="flex flex-wrap gap-3 mb-6">
            {game.genres.slice(0, 4).map(g => (
              <span key={g.name} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-purple-300 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                {g.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-8 transform -skew-x-6 origin-left">
            {game.name}
          </h1>

          {/* Key Metrics */}
          <div className="flex flex-wrap items-center gap-8 md:gap-16 border-t border-white/10 pt-6 w-full mb-12">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-yellow-400 flex items-center gap-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  {game.rating}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Released</span>
              <span className="text-2xl font-bold text-slate-200 font-mono tracking-tighter">
                {game.released}
              </span>
            </div>
          </div>

          {/* --- NEW CAROUSEL SECTION (Moved Up) --- */}
          <div className="relative w-full mb-12 group">
            <h2 className="text-sm font-bold text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-purple-500"></span> Snapshots
            </h2>
            
            {/* Carousel Container */}
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar py-4 px-2 -mx-2">
              {screenshots.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedImage(s.image)}
                  className="snap-center shrink-0 w-[300px] md:w-[450px] aspect-video relative rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-800"
                >
                  <img 
                    src={s.image} 
                    alt="gameplay" 
                    className="w-full h-full object-cover hover:brightness-110 transition-all"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                     <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/50 backdrop-blur px-2 py-1 rounded">Expand</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Fade effect on sides to indicate scrolling */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none z-10" />
          </div>

        </div>
      </div>

      {/* --- DETAILS & SIDEBAR --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Story Section */}
        <div className="lg:col-span-8 space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-purple-600 rounded-full shadow-[0_0_10px_#9333ea]"></div>
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white">THE NARRATIVE</h2>
            </div>
            <div className="relative p-8 bg-slate-900/50 ring-1 ring-white/5 rounded-3xl backdrop-blur-sm">
               <p className="text-slate-300 leading-loose text-lg md:text-xl font-light tracking-wide text-justify whitespace-pre-line first-letter:text-5xl first-letter:font-black first-letter:text-purple-500 first-letter:mr-3 first-letter:float-left">
                  {game.description_raw}
                </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8 relative">
          <div className="sticky top-10 space-y-8">
            
            {/* Specs Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
              
              <h3 className="text-xl font-black italic mb-8 text-white flex items-center gap-2">
                <span className="text-purple-500 text-2xl">#</span> DATA
              </h3>
              
              <div className="space-y-6 relative z-10">
                {/* Platforms */}
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map(p => (
                      <span key={p.platform.name} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors border border-white/5">
                        {p.platform.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publisher */}
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Publisher</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">
                      {game.publishers[0]?.name.charAt(0) || "D"}
                    </div>
                    <p className="text-base font-bold text-slate-200">{game.publishers[0]?.name || "N/A"}</p>
                  </div>
                </div>

                 {/* Website Link */}
                 {game.website && (
                    <a href={game.website} target="_blank" rel="noopener noreferrer"
                     className="block w-full text-center py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-white/5 transition-all text-xs uppercase font-bold tracking-widest mt-4">
                      Visit Official Site
                    </a>
                 )}
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full relative group overflow-hidden bg-white text-black py-5 rounded-2xl font-black text-lg uppercase italic tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-300">
                GET GAME
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}