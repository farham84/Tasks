"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import GameCard from "../components/gameCard";
import TopWeak from "../components/topWeak";
import TopPopular from "../components/popular";
import GameListSection from "../components/pagination";
import { Game, Genre } from "../components/types";

const pageSize = 20;

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [genresList, setGenresList] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const genreScrollRef = useRef<HTMLDivElement>(null);

  
  const loadGames = useCallback(async (params: any) => {
    setLoading(true);
    try {
      
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/games?${queryString}`);
      const data = await response.json();
      
      setGames(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / pageSize));
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce((params) => loadGames(params), 600),
    [loadGames]
  );

  
  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await fetch('/api/genres');
        const genresData = await response.json();
        setGenresList([{ id: 0, name: "All Genres", slug: "" }, ...genresData]);
      } catch (e) {
        console.error("Failed to fetch genres", e);
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    const params: any = { page: currentPage.toString(), page_size: pageSize.toString() };
    if (search) params.search = search;
    if (genre) params.genres = genre;

    debouncedFetch(params);
    return () => debouncedFetch.cancel();
  }, [search, genre, currentPage, debouncedFetch]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const scrollGenres = (direction: 'left' | 'right') => {
    const ref = genreScrollRef.current;
    if (ref) {
      const scrollAmount = ref.clientWidth * 0.8; 
      ref.scrollTo({
        left: ref.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-10 font-sans selection:bg-purple-500/30">
      <header className="max-w-3xl mx-auto text-center mb-20 pt-14 px-4">
        <h1 className="relative text-4xl md:text-8xl font-extrabold italic mb-6 leading-[0.95]">
          <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-[-0.03em] drop-shadow-[0_6px_20px_rgba(168,85,247,0.35)]">
            jojo
          </span>
          <span className="block text-white tracking-[-0.015em]">
            Game Hub
          </span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto">
          کشفی، مرور و لذت بردن از دنیای بازی‌ها با ما! 🎮✨
        </p>
      </header>

      <TopWeak />
      <TopPopular />

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full my-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto mb-12 space-y-8">
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl flex items-center shadow-xl overflow-hidden">
                <div className="pl-6 text-slate-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for games..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-transparent border-none px-4 py-5 focus:outline-none text-lg text-white placeholder-slate-500 font-medium"
                />
            </div>
        </div>

        <div className="w-full relative flex items-center">
            <button 
                onClick={() => scrollGenres('left')}
                className="absolute left-0 z-20 p-3 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm rounded-full shadow-lg transition duration-300 border border-white/10 ml-2 md:ml-0"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <div 
                ref={genreScrollRef}
                className="flex gap-3 overflow-x-scroll pb-4 pt-1 px-14 hide-scrollbar snap-x flex-grow"
            >
                {genresList.map((g) => {
                    const isActive = genre === g.slug;
                    return (
                        <button
                            key={g.id || 'all'}
                            onClick={() => { setGenre(g.slug); setCurrentPage(1); }}
                            className={`
                                snap-start shrink-0 px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 border-2
                                ${isActive 
                                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_25px_rgba(147,51,234,0.7)] scale-105' 
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-purple-500/50'
                                }
                            `}
                        >
                            {g.name}
                        </button>
                    );
                })}
            </div>

            <button 
                onClick={() => scrollGenres('right')}
                className="absolute right-0 z-20 p-3 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm rounded-full shadow-lg transition duration-300 border border-white/10 mr-2 md:mr-0"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <GameListSection
        loading={loading}
        games={games}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}