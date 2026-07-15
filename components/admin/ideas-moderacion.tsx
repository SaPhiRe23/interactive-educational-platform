// components/admin/ideas-moderacion.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getIdeas, deleteIdea } from '@/app/actions/ideas';

interface IdeaData {
  id: number;
  reto: string;
  texto: string;
  votos: number;
  createdAt: string;
}

export default function IdeasModeracion() {
  const [list, setList] = useState<IdeaData[]>([]);

  const loadData = () => {
    getIdeas().then((data) => setList(data as any));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta propuesta?')) {
      const res = await deleteIdea(id);
      if (res.success) loadData();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="font-semibold text-gray-700">
          Moderación de Propuestas (Momento 5 / 6) — {list.length} en total
        </h2>
      </div>

      <div className="divide-y max-h-[500px] overflow-y-auto">
        {list.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Aún no hay propuestas registradas.</p>
        ) : (
          list.map((idea) => (
            <div key={idea.id} className="p-4 flex justify-between items-center hover:bg-gray-50 gap-4">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800 mb-1">
                  {idea.reto}
                </span>
                <p className="text-gray-800 font-medium text-sm">"{idea.texto}"</p>
                <p className="text-xs text-gray-400">
                  {idea.votos} voto(s) · {new Date(idea.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(idea.id)}
                className="shrink-0 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
