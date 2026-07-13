// app/admin/mapa/momento-1-mural.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getHuellas, deleteHuella } from '@/app/actions/huellas';

interface HuellaData {
  id: number;
  texto: string;
  createdAt: string;
}

export default function AdminMapaPage() {
  const [list, setList] = useState<HuellaData[]>([]);

  const loadData = () => {
    getHuellas().then((data) => setList(data as any));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta huella?")) {
      const res = await deleteHuella(id);
      if (res.success) {
        loadData();
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Control: Mapa y Huellas</h1>
      
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-gray-700">Moderación de Huellas Recibidas (Momento 1)</h2>
        </div>
        
        <div className="divide-y max-h-[500px] overflow-y-auto">
          {list.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">Aún no hay huellas registradas.</p>
          ) : (
            list.map((h) => (
              <div key={h.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="text-gray-800 font-medium">👣 "{h.texto}"</p>
                  <p className="text-xs text-gray-400">
                    Enviada el: {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}