// components/admin/momento-5-retos.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { addIdea, getIdeas } from '@/app/actions/ideas';

interface IdeaData {
  id: number;
  reto: string;
  texto: string;
  votos: number;
}

const RETOS = [
  { id: 'Tiempo libre', label: 'Tiempo libre', icon: Clock },
  { id: 'Liderazgo', label: 'Liderazgo', icon: Users },
  { id: 'Inclusión', label: 'Inclusión', icon: HeartHandshake },
  { id: 'Estrés', label: 'Estrés', icon: Zap },
  { id: 'Disciplina', label: 'Disciplina', icon: ShieldCheck },
  { id: 'Nuevas amistades', label: 'Nuevas amistades', icon: Sparkles },
];

export default function Momento5Retos({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'select' | 'write' | 'sent' | 'wall'>('select');
  const [retoActivo, setRetoActivo] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ideasList, setIdeasList] = useState<IdeaData[]>([]);

  const loadIdeas = () => {
    getIdeas().then((data) => setIdeasList(data as IdeaData[]));
  };

  useEffect(() => {
    if (step === 'wall') loadIdeas();
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || !retoActivo) return;

    setCargando(true);
    const res = await addIdea(retoActivo, texto.trim());
    setCargando(false);

    if (res.success) {
      setStep('sent');
      setTexto('');
    } else {
      alert('Hubo un problema al enviar tu propuesta.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col text-black border border-sky-200">
        {/* Cabecera */}
        <div className="p-5 border-b flex justify-between items-center bg-sky-50">
          <h2 className="text-xl font-bold text-sky-900 flex items-center gap-2">
            💡 Momento 5: El reto del futuro
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* PASO 1: ELEGIR RETO */}
          {step === 'select' && (
            <div className="space-y-6 my-auto text-center">
              <Lightbulb className="h-10 w-10 text-sky-600 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800">Escoge un reto</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                ¿Sobre cuál de estos retos de los jóvenes quieres proponer una idea?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {RETOS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRetoActivo(r.id);
                      setStep('write');
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 hover:border-sky-400 transition group shadow-sm"
                  >
                    <r.icon className="h-7 w-7 text-sky-600 group-hover:scale-110 transition" />
                    <span className="font-bold text-xs text-sky-900">{r.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('wall')}
                className="inline-flex items-center gap-2 text-sky-700 hover:underline text-sm font-semibold"
              >
                <Layers className="h-4 w-4" />
                Ver el muro de ideas
              </button>
            </div>
          )}

          {/* PASO 2: ESCRIBIR PROPUESTA */}
          {step === 'write' && retoActivo && (
            <form onSubmit={handleSubmit} className="space-y-4 my-auto max-w-md mx-auto text-center">
              <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                Reto: {retoActivo}
              </span>
              <h3 className="font-semibold text-gray-700 text-lg">
                ¿Qué propuesta se te ocurre para este reto?
              </h3>
              <textarea
                required
                rows={4}
                placeholder="Escribe tu idea aquí..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-black text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex items-center gap-1 border border-sky-200 text-sky-700 font-bold py-3 px-4 rounded-lg text-sm hover:bg-sky-50 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cambiar reto
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {cargando ? 'Enviando...' : (
                    <>
                      Enviar propuesta <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: CONFIRMACIÓN */}
          {step === 'sent' && (
            <div className="text-center space-y-4 my-auto">
              <div className="text-5xl">🎉</div>
              <h3 className="font-bold text-sky-800 text-xl">¡Tu idea ya es parte del muro!</h3>
              <p className="text-sm text-gray-600">
                Gracias por proponer soluciones para el futuro de los jóvenes del Patinódromo.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setRetoActivo(null);
                    setStep('select');
                  }}
                  className="text-sm text-sky-600 hover:underline font-semibold"
                >
                  Proponer otra idea
                </button>
                <button
                  onClick={() => setStep('wall')}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                >
                  Ver el muro de ideas <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* MURO DE IDEAS */}
          {step === 'wall' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-700">Muro de ideas de los visitantes</h3>
                <button
                  onClick={() => setStep('select')}
                  className="text-xs font-semibold text-sky-700 hover:underline"
                >
                  ← Proponer una idea
                </button>
              </div>

              {ideasList.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-10">
                  Todavía no hay propuestas. ¡Sé el primero!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {ideasList.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 shadow-sm"
                    >
                      <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 mb-2">
                        {idea.reto}
                      </span>
                      <p className="text-sm text-gray-700 leading-snug">{idea.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
