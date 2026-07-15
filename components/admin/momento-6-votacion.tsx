// components/admin/momento-6-votacion.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Vote, Trophy, CheckCircle2, BarChart3 } from 'lucide-react';
import { getIdeas, voteIdea } from '@/app/actions/ideas';

interface IdeaData {
  id: number;
  reto: string;
  texto: string;
  votos: number;
}

const VOTED_KEY = 'patinodromo_idea_votada';

export default function Momento6Votacion({ onClose }: { onClose: () => void }) {
  const [ideasList, setIdeasList] = useState<IdeaData[]>([]);
  const [votedId, setVotedId] = useState<number | null>(null);
  const [votando, setVotando] = useState<number | null>(null);
  const [view, setView] = useState<'votar' | 'resultados'>('votar');

  const loadIdeas = () => {
    getIdeas().then((data) => setIdeasList(data as IdeaData[]));
  };

  useEffect(() => {
    loadIdeas();
    const stored = window.localStorage.getItem(VOTED_KEY);
    if (stored) setVotedId(Number(stored));
  }, []);

  const handleVote = async (id: number) => {
    if (votedId !== null) return;

    setVotando(id);
    const res = await voteIdea(id);
    setVotando(null);

    if (res.success) {
      window.localStorage.setItem(VOTED_KEY, String(id));
      setVotedId(id);
      loadIdeas();
    } else {
      alert('Hubo un problema al registrar tu voto.');
    }
  };

  const totalVotos = ideasList.reduce((sum, i) => sum + i.votos, 0);
  const sortedByVotes = [...ideasList].sort((a, b) => b.votos - a.votos);
  const winner = sortedByVotes[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col text-black border border-violet-200">
        {/* Cabecera */}
        <div className="p-5 border-b bg-violet-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-violet-900 flex items-center gap-2">
              🗳️ Momento 6: Decisión colectiva
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">
              ✕
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setView('votar')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                view === 'votar' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
              }`}
            >
              Votar
            </button>
            <button
              onClick={() => setView('resultados')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                view === 'resultados' ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Resultados
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {ideasList.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-10">
              Todavía no hay propuestas para votar. Anímate a proponer una en "El reto del futuro".
            </p>
          ) : view === 'votar' ? (
            <div className="space-y-4">
              {votedId !== null && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  ¡Ya registramos tu voto! Puedes ver los resultados en tiempo real.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ideasList.map((idea) => {
                  const isMyVote = votedId === idea.id;
                  return (
                    <div
                      key={idea.id}
                      className={`rounded-xl border p-4 shadow-sm transition ${
                        isMyVote ? 'bg-violet-50 border-violet-400' : 'bg-white border-violet-200'
                      }`}
                    >
                      <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-800 mb-2">
                        {idea.reto}
                      </span>
                      <p className="text-sm text-gray-700 leading-snug mb-3">{idea.texto}</p>
                      <button
                        onClick={() => handleVote(idea.id)}
                        disabled={votedId !== null || votando === idea.id}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
                          isMyVote
                            ? 'bg-violet-600 text-white cursor-default'
                            : votedId !== null
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        <Vote className="h-3.5 w-3.5" />
                        {isMyVote ? 'Tu voto' : votando === idea.id ? 'Votando...' : 'Votar por esta idea'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-xs text-gray-500">{totalVotos} voto(s) en total</p>

              {winner && winner.votos > 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <Trophy className="h-8 w-8 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Propuesta más votada</p>
                    <p className="text-sm font-semibold text-amber-900">{winner.texto}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {sortedByVotes.map((idea) => {
                  const pct = totalVotos > 0 ? Math.round((idea.votos / totalVotos) * 100) : 0;
                  return (
                    <div key={idea.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700 truncate pr-2">{idea.texto}</span>
                        <span className="font-bold text-violet-700 shrink-0">{idea.votos}</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-violet-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-600 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
