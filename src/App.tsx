/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Target, AlertCircle, Loader2, X, Info, Globe, Ruler, Footprints, TrendingUp, DollarSign, Layout, ChevronRight, Activity } from "lucide-react";
import { cn } from "./lib/utils";

interface Biodata {
  nationality: string;
  position: string;
  height: string;
  preferred_foot: string;
  market_value: string;
  strengths: string[];
}

interface Target {
  player_name: string;
  current_club: string;
  age: number;
  estimated_cost: string;
  why_they_fit: string;
  key_stat: string;
  biodata: Biodata;
}

interface LineupAnalysis {
  current_weakness: string;
  suggested_tactical_shift: string;
}

interface ScoutReport {
  tactical_analysis: string;
  current_formation: string;
  lineup_analysis: LineupAnalysis;
  recommended_targets: Target[];
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [report, setReport] = useState<ScoutReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Target | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setReport(null);
    setSelectedPlayer(null);

    try {
      const response = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("The scout was unable to process your request.");
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-united-red selection:text-white pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-united-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-800 pb-8 mb-12">
          <div className="flex items-center gap-6">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"
              alt="MUFC"
              referrerPolicy="no-referrer"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(218,41,28,0.3)]"
            />
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <h1 className="text-[10px] font-mono text-united-red uppercase tracking-[0.3em] font-bold">Tactical Intelligence Engine</h1>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tight text-white font-display"
              >
                THE UNITED SCOUT<span className="text-united-red">.</span>
              </motion.h1>
            </div>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] text-zinc-500 uppercase leading-relaxed">
            <p>Status: {loading ? "Analyzing..." : "Ready"}</p>
            <p>Priority: Critical Rebuild Grade A</p>
          </div>
        </header>

        {/* Input Section */}
        <section className="mb-12">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-united-red/30 rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-40" />
            <div className="relative bg-[#0F0F0F] rounded-sm border border-zinc-800 p-2 shadow-2xl flex items-center">
              <div className="pl-4 text-zinc-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Identify squad weakness or tactical requirement..."
                className="w-full bg-transparent px-4 py-4 text-lg focus:outline-none placeholder:text-zinc-700 font-light"
              />
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "px-8 py-4 bg-united-red hover:bg-red-800 text-white rounded-sm transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-50",
                  loading && "animate-pulse"
                )}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Deploy Scout"}
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 justify-start">
            {["High-composure midfield anchor", "Elite box-to-box engine", "Speed to complement Leny Yoro", "Clinical left-footed winger"].map((hint) => (
              <button
                key={hint}
                onClick={() => setPrompt(hint)}
                className="text-[9px] uppercase tracking-[0.2em] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-sm text-zinc-500 hover:text-united-red hover:border-united-red/30 transition-colors font-mono"
              >
                {hint}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/10 border border-red-900/50 p-6 rounded-sm flex items-center gap-4 text-red-400 mb-8"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-light">{error}</p>
            </motion.div>
          )}

          {report && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-12 auto-rows-min gap-4"
            >
              {/* Tactical Analysis Card */}
              <div className="col-span-12 lg:col-span-8 bg-zinc-900/30 border border-zinc-800 p-8 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="white">
                    <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
                    <path d="M50 10 V90 M10 50 H90" />
                  </svg>
                </div>
                <h2 className="text-united-red text-[10px] font-mono uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-united-red animate-pulse"></span> Tactical Briefing
                </h2>
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-100 italic">
                  "{report.tactical_analysis}"
                </p>
              </div>

              {/* Formation Analysis Card */}
              <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 p-8 rounded-sm flex flex-col justify-between group">
                <div>
                  <h2 className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em] font-bold mb-4">Formation Intelligence</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-united-red/20 border border-united-red/40 px-4 py-2 rounded-sm">
                      <span className="text-2xl font-black text-united-red font-display">{report.current_formation}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono italic">Primary Configuration</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-t border-zinc-800 pt-4">
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-2">Structural Weakness</p>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">{report.lineup_analysis.current_weakness}</p>
                  </div>
                  <div className="border-t border-zinc-800 pt-4">
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-2">Suggested Shift</p>
                    <p className="text-xs text-zinc-300 leading-relaxed font-bold text-united-red">{report.lineup_analysis.suggested_tactical_shift}</p>
                  </div>
                </div>
              </div>

              {/* Targets List */}
              {report.recommended_targets.map((target, idx) => (
                <motion.div
                  key={target.player_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between group hover:border-united-red/30 transition-colors"
                >
                  <div className="relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-zinc-800 text-[9px] font-mono px-2 py-1 text-zinc-400">ID: TARGET_0{idx + 1}</div>
                      {idx === 0 && <div className="text-[#fbe122] font-mono text-[9px] font-bold tracking-widest">TOP CHOICE</div>}
                    </div>
                    <button 
                      onClick={() => setSelectedPlayer(target)}
                      className="group/btn text-left"
                    >
                      <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-united-red transition-colors inline-flex items-center gap-2">
                        {target.player_name}
                        <Info className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity text-zinc-500" />
                      </h3>
                      <p className="text-zinc-500 text-xs mb-6 font-mono uppercase tracking-tighter">{target.current_club} • {target.age} Years Old</p>
                    </button>
                    <p className="text-sm leading-relaxed text-zinc-300 font-light min-h-[80px]">
                      {target.why_they_fit}
                    </p>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="bg-black/50 p-4 border border-zinc-800/50">
                      <p className="text-[9px] text-zinc-500 font-mono uppercase mb-1 tracking-widest">Estimated Value</p>
                      <p className="text-lg font-bold text-united-red">{target.estimated_cost}</p>
                    </div>
                    <div className="border-l-2 border-united-red pl-4 py-1">
                      <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Primary Metric</p>
                      <p className="text-xs italic font-medium uppercase text-zinc-200 mt-1">{target.key_stat}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPlayer(target)}
                      className="w-full py-2 bg-zinc-800 hover:bg-united-red text-zinc-400 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      View Full Biodata
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!report && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-24 opacity-30 filter grayscale hover:grayscale-0 transition-all duration-700"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png" 
                alt="Manchester United Crest" 
                referrerPolicy="no-referrer"
                className="w-32 h-32 mb-8 select-none pointer-events-none"
              />
              <p className="uppercase tracking-[0.5em] text-[10px] font-bold font-mono">Awaiting Strategic Directives</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Biodata Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlayer(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0D0D0D] border-l border-zinc-800 z-[101] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-united-red text-[10px] font-mono uppercase tracking-[0.4em] font-bold mb-2">Elite Intelligence Feed</p>
                  <h2 className="text-4xl font-black text-white font-display mb-1">{selectedPlayer.player_name}</h2>
                  <p className="text-zinc-500 font-mono text-xs uppercase">{selectedPlayer.current_club}</p>
                </div>
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800 group hover:border-united-red/30 transition-colors">
                    <Globe className="w-4 h-4 text-united-red mb-3" />
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-1">Nationality</p>
                    <p className="text-sm font-bold text-white">{selectedPlayer.biodata.nationality}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800 group hover:border-united-red/30 transition-colors">
                    <Layout className="w-4 h-4 text-united-red mb-3" />
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-1">Position</p>
                    <p className="text-sm font-bold text-white">{selectedPlayer.biodata.position}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800 group hover:border-united-red/30 transition-colors">
                    <Ruler className="w-4 h-4 text-united-red mb-3" />
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-1">Height</p>
                    <p className="text-sm font-bold text-white">{selectedPlayer.biodata.height}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800 group hover:border-united-red/30 transition-colors">
                    <Footprints className="w-4 h-4 text-united-red mb-3" />
                    <p className="text-[9px] text-zinc-600 font-mono uppercase mb-1">Preferred Foot</p>
                    <p className="text-sm font-bold text-white">{selectedPlayer.biodata.preferred_foot}</p>
                  </div>
                </div>

                {/* Market Power */}
                <div className="bg-united-red p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-4 h-4 text-black" />
                    <p className="text-black text-[10px] font-mono font-black uppercase tracking-widest">Market Valuation</p>
                  </div>
                  <p className="text-3xl font-black text-black">{selectedPlayer.biodata.market_value}</p>
                </div>

                {/* Tactical Strengths */}
                <div>
                  <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-bold mb-4">Technical Core</h3>
                  <div className="space-y-2">
                    {selectedPlayer.biodata.strengths.map((str) => (
                      <div key={str} className="flex items-center gap-3 bg-zinc-900 p-3 border border-zinc-800 ring-1 ring-inset ring-transparent hover:ring-united-red/20 transition-all">
                        <Activity className="w-3 h-3 text-united-red" />
                        <span className="text-sm text-zinc-300 font-light">{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Stat Final Recap */}
                <div className="p-6 bg-black border border-zinc-800 text-center">
                  <TrendingUp className="w-5 h-5 text-united-red mx-auto mb-3" />
                  <p className="text-xs text-zinc-500 italic mb-2">Final Scout Metric</p>
                  <p className="text-xl font-bold font-display text-white">{selectedPlayer.key_stat}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer Meta */}
      <footer className="mt-20 border-t border-zinc-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <div className="flex items-center gap-6 text-[9px] font-mono uppercase tracking-[0.2em] font-bold">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> ENCRYPTED FEED</span>
            <span className="text-zinc-700">|</span>
            <span>CARRINGTON DATA HUB</span>
          </div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold">© 2026 MANCHESTER UNITED INTEL ENGINE v4.0.2</p>
        </div>
      </footer>
    </div>
  );
}
