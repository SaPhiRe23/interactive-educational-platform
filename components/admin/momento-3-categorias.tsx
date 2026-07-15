// components/admin/momento-3-categorias.tsx
'use client';

import React, { useState } from 'react';
import { Zap, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { HISTORIAS, CATEGORIAS } from '@/lib/momento-data';

export default function Momento3Categorias({ onClose }: { onClose: () => void }) {
  const [orden] = useState(() => [...HISTORIAS].sort(() => Math.random() - 0.5));
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [puntos, setPuntos] = useState(0);
  const [volando, setVolando] = useState(false);

  const historia = orden[indice];
  const terminado = indice >= orden.length;
  const acerto = elegida === historia?.categoria;

  const handleElegir = (categoria: string) => {
    if (elegida) return;
    setVolando(true);
    setTimeout(() => {
      setElegida(categoria);
      setVolando(false);
      if (categoria === historia.categoria) setPuntos((p) => p + 1);
    }, 350);
  };

  const handleSiguiente = () => {
    setElegida(null);
    setIndice((i) => i + 1);
  };

  const reiniciar = () => {
    setIndice(0);
    setElegida(null);
    setPuntos(0);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col text-black border border-rose-200">
        {/* Cabecera */}
        <div className="p-5 border-b bg-rose-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-rose-900 flex items-center gap-2">
            🏃 Momento 3: Corre a tu respuesta
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!terminado ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
                <span>
                  Frase {indice + 1} de {orden.length}
                </span>
                <span>Puntos: {puntos}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-rose-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${(indice / orden.length) * 100}%` }}
                />
              </div>

              {/* Frase */}
              <div
                className={`mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center shadow-sm transition-all duration-300 ${
                  volando ? 'scale-90 opacity-0 -translate-y-6' : 'scale-100 opacity-100'
                }`}
              >
                <p className="text-lg font-semibold text-gray-800">"{historia.texto}"</p>
              </div>

              {/* Categorías */}
              {!elegida ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleElegir(cat)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-3 text-xs font-bold text-rose-800 shadow-sm transition hover:bg-rose-100 hover:border-rose-400 hover:scale-105"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mx-auto max-w-md space-y-4 text-center">
                  <div
                    className={`flex items-center justify-center gap-2 rounded-xl p-4 font-bold ${
                      acerto ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {acerto ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    {acerto ? '¡Correcto!' : `Era: ${historia.categoria}`}
                  </div>
                  <p className="text-sm text-gray-600">{historia.explicacion}</p>
                  <button
                    onClick={handleSiguiente}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition"
                  >
                    Siguiente frase
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4 py-6">
              <Trophy className="h-12 w-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold text-rose-900">¡Terminaste el reto!</h3>
              <p className="text-gray-600">
                Acertaste <span className="font-bold text-rose-700">{puntos}</span> de {orden.length} frases.
              </p>
              <button
                onClick={reiniciar}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition"
              >
                <RotateCcw className="h-4 w-4" />
                Jugar de nuevo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
