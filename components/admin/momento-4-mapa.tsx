// components/admin/momento-4-mapa.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { MapPin, CheckCircle2, RotateCcw, PartyPopper } from 'lucide-react';
import { HISTORIAS, CATEGORIAS } from '@/lib/momento-data';

function posEnCirculo(index: number, total: number) {
  // Empezamos arriba (-90°) y repartimos el resto de categorías alrededor del círculo.
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radiusX = 42;
  const radiusY = 40;
  return {
    left: 50 + radiusX * Math.cos(angle),
    top: 50 + radiusY * Math.sin(angle),
  };
}

export default function Momento4Mapa({ onClose }: { onClose: () => void }) {
  const [tarjetas] = useState(() => [...HISTORIAS].sort(() => Math.random() - 0.5));
  const [colocadas, setColocadas] = useState<Record<string, number>>({}); // categoria -> historiaId
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendientes = useMemo(
    () => tarjetas.filter((h) => !Object.values(colocadas).includes(h.id)),
    [tarjetas, colocadas],
  );

  const completado = pendientes.length === 0;

  const handleSoltar = (categoria: string) => {
    if (seleccionada === null || colocadas[categoria]) return;

    const historia = tarjetas.find((h) => h.id === seleccionada);
    if (!historia) return;

    if (historia.categoria === categoria) {
      setColocadas((prev) => ({ ...prev, [categoria]: historia.id }));
      setSeleccionada(null);
      setError(null);
    } else {
      setError(categoria);
      setTimeout(() => setError(null), 500);
    }
  };

  const reiniciar = () => {
    setColocadas({});
    setSeleccionada(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col text-black border border-teal-200">
        {/* Cabecera */}
        <div className="p-5 border-b bg-teal-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-teal-900 flex items-center gap-2">
            🗺️ Momento 4: Construye el mapa
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!completado ? (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-600 max-w-md mx-auto">
                Toca una historia y luego toca la categoría del mapa a la que crees que pertenece.
              </p>

              {/* El mapa circular */}
              <div className="relative mx-auto aspect-square w-full max-w-sm">
                <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-teal-600 text-white text-center p-4 shadow-lg">
                  <span className="font-heading text-xs sm:text-sm font-bold leading-tight">
                    Mapa de
                    <br />
                    Oportunidades
                    <br />
                    Juveniles
                  </span>
                </div>

                {CATEGORIAS.map((cat, i) => {
                  const pos = posEnCirculo(i, CATEGORIAS.length);
                  const llena = Boolean(colocadas[cat]);
                  const conError = error === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleSoltar(cat)}
                      style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 p-1.5 text-center shadow-sm transition-all ${
                        llena
                          ? 'bg-teal-100 border-teal-500'
                          : conError
                            ? 'bg-rose-100 border-rose-400 animate-pulse'
                            : 'bg-white border-teal-300 hover:border-teal-500 hover:bg-teal-50'
                      }`}
                    >
                      {llena ? (
                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      )}
                      <span className="text-[9px] sm:text-[10px] font-bold leading-tight text-teal-900">{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tarjetas de historias */}
              <div>
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Historias por ubicar ({pendientes.length})
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto px-1">
                  {pendientes.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSeleccionada(seleccionada === h.id ? null : h.id)}
                      className={`max-w-[220px] rounded-xl border p-3 text-left text-xs shadow-sm transition ${
                        seleccionada === h.id
                          ? 'bg-teal-600 text-white border-teal-600 scale-105'
                          : 'bg-white border-teal-200 text-gray-700 hover:border-teal-400'
                      }`}
                    >
                      {h.texto}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <PartyPopper className="h-12 w-12 text-teal-600 mx-auto" />
              <h3 className="text-xl font-bold text-teal-900">¡Excelente!</h3>
              <p className="max-w-sm mx-auto text-gray-600">
                Así construimos el Mapa de Oportunidades Juveniles del Patinódromo.
              </p>
              <button
                onClick={reiniciar}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition"
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
