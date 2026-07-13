// components/admin/mural-huellas.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { addHuella, getHuellas } from '@/app/actions/huellas'; // Importa las acciones del archivo 1

interface HuellaData {
  id: number;
  texto: string;
  posX: number;
  posY: number;
}

export default function MuralHuellas({ onClose }: { onClose: () => void }) {
  const [texto, setTexto] = useState('');
  const [huellasList, setHuellasList] = useState<HuellaData[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Cargar las huellas existentes
  useEffect(() => {
    getHuellas().then((data) => setHuellasList(data as HuellaData[]));
  }, [enviado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setCargando(true);
    const res = await addHuella(texto);
    setCargando(false);

    if (res.success) {
      setEnviado(true);
      setTexto('');
    } else {
      alert("Hubo un problema al guardar tu huella.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Cabecera */}
        <div className="p-5 border-b flex justify-between items-center bg-emerald-50">
          <h2 className="text-xl font-bold text-emerald-800">
            👣 Momento 1: Mi huella en la ciudad
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          
          {/* Lado izquierdo: El Formulario */}
          <div className="flex-1 bg-gray-50 p-6 rounded-xl border flex flex-col justify-center items-center">
            {!enviado ? (
              <form onSubmit={handleSubmit} className="w-full space-y-4 text-center">
                <div className="w-24 h-32 mx-auto bg-emerald-100 border-2 border-dashed border-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👣</span>
                </div>
                <h3 className="font-semibold text-gray-700 text-lg">
                  ¿Qué lugar de Barranquilla te ha ayudado a crecer?
                </h3>
                <input
                  type="text"
                  required
                  placeholder="Ej: El Malecón, el parque de mi barrio..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                />
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {cargando ? "Enviando..." : "Enviar Huella"}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="font-bold text-emerald-800 text-xl">¡Tu huella ha sido plasmada!</h3>
                <p className="text-sm text-gray-600">Ahora forma parte del mural digital interactivo.</p>
                <button 
                  onClick={() => setEnviado(false)} 
                  className="text-sm text-emerald-600 hover:underline font-semibold"
                >
                  Escribir otra huella
                </button>
              </div>
            )}
          </div>

          {/* Lado derecho: El Mural */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-gray-700 mb-2">Mural Digital (Patinódromo):</h3>
            
            <div className="relative flex-1 min-h-[300px] bg-slate-100 rounded-xl border-4 border-emerald-600 overflow-hidden">
              <div className="absolute inset-4 border-4 border-dashed border-white rounded-full pointer-events-none bg-slate-200/50" />
              
              {huellasList.map((h) => (
                <div
                  key={h.id}
                  style={{ left: `${h.posX}%`, top: `${h.posY}%` }}
                  className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                >
                  <span className="text-2xl filter drop-shadow hover:scale-125 transition-transform block">👣</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {h.texto}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}