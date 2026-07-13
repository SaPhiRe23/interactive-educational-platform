// components/admin/mapa/momento-2-historias.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Play, Award, ArrowRight, Lock, Sparkles, Smile, Flame, StopCircle } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  name: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const STORIES: Story[] = [
  {
    id: 1,
    name: "Juan",
    title: "Nuevos amigos, nuevas oportunidades 👣",
    text: "Juan, de 15 años, acababa de llegar al barrio y pasaba la mayor parte del tiempo solo en casa. No conocía a otros jóvenes y le costaba iniciar conversaciones porque era muy tímido. Después de varios meses sintiéndose aislado, decidió participar en una actividad realizada en el Patinódromo. Al principio observaba desde lejos, pero poco a poco comenzó a integrarse a los juegos y actividades. Allí conoció a otros jóvenes con intereses similares, aprendió a trabajar en equipo y construyó nuevas amistades. Hoy Juan participa activamente en las actividades comunitarias y siente que hace parte de un grupo que lo escucha, lo apoya y lo motiva a seguir creciendo.",
    question: "¿Qué logró Juan gracias al Patinódromo?",
    options: ["Nuevos amigos", "Más problemas", "Se aisló"],
    correctAnswer: 0
  },
  {
    id: 2,
    name: "María",
    title: "Descubriendo mis capacidades ✨",
    text: "María tiene 17 años y constantemente pensaba que no era buena para nada. Le daba miedo participar en actividades porque creía que iba a equivocarse o que los demás se burlarían de ella. Un día asistió a una actividad juvenil en el Patinódromo donde le propusieron liderar una pequeña dinámica. Aunque al principio dudó, aceptó el reto. Con el apoyo de otros jóvenes y facilitadores descubrió que podía expresarse, organizar actividades y aportar ideas valiosas. Poco a poco ganó confianza en sí misma. Actualmente participa con seguridad, expresa sus opiniones y reconoce muchas de las capacidades que antes no veía en ella misma.",
    question: "¿Qué descubrió María al liderar la dinámica?",
    options: ["Que todos se burlaban", "Que no servía para nada", "Que podía expresarse y liderar"],
    correctAnswer: 2
  },
  {
    id: 3,
    name: "Andrés",
    title: "El valor de la disciplina ⏱️",
    text: "Andrés, de 18 años, tenía muchas metas, pero le costaba ser constante. Empezaba actividades y rápidamente las abandonaba. Esto le generaba frustración porque sentía que no avanzaba en sus proyectos. A través de las actividades realizadas en el Patinódromo comenzó a participar en retos grupales que requerían compromiso, puntualidad y trabajo continuo. Con el tiempo aprendió a organizar mejor su tiempo, cumplir responsabilidades y mantener el esfuerzo incluso cuando las cosas se volvían difíciles. Hoy Andrés aplica estos aprendizajes en sus estudios y en otros aspectos de su vida.",
    question: "¿Qué valor aprendió Andrés en el Patinódromo?",
    options: ["La disciplina y el compromiso", "La pereza", "A abandonar rápido"],
    correctAnswer: 0
  }
];

export default function Momento2Historias({ onClose }: { onClose: () => void }) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [unlockedIdx, setUnlockedIdx] = useState(0); // Controla qué historias están desbloqueadas
  const [mode, setMode] = useState<'select' | 'read' | 'audio' | 'animation' | 'quiz'>('select');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const activeStory = STORIES[activeStoryIdx];

  // Detener la voz al cambiar de pantalla o cerrar
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Función para reproducir el Audio (Text-to-Speech)
  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(activeStory.text);
        utterance.lang = 'es-CO'; // Español Colombiano o genérico
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Tu navegador no soporta síntesis de voz automática.");
    }
  };

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    if (idx === activeStory.correctAnswer) {
      setQuizSuccess(true);
      // Desbloquear la siguiente historia si aplica
      if (activeStoryIdx === unlockedIdx && unlockedIdx < STORIES.length - 1) {
        setUnlockedIdx(unlockedIdx + 1);
      }
    } else {
      setQuizSuccess(false);
    }
  };

  const handleNextStory = () => {
    if (activeStoryIdx < STORIES.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
      setMode('select');
      setSelectedAnswer(null);
      setQuizSuccess(false);
    } else {
      onClose(); // Fin de la dinámica
    }
  };

  // Porcentaje de progreso de las historias completadas/desbloqueadas
  const progressPercent = Math.round(((unlockedIdx + (mode === 'quiz' && quizSuccess ? 1 : 0)) / STORIES.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      {/* Estilos CSS para las mini-animaciones inline */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes grow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes run {
          0% { transform: translateX(-30px); }
          50% { transform: translateX(30px); }
          100% { transform: translateX(-30px); }
        }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-grow { animation: grow 2s ease-in-out infinite; }
        .anim-run { animation: run 4s linear infinite; }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col text-black">
        
        {/* Cabecera con barra de progreso */}
        <div className="p-5 border-b bg-amber-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              📖 Momento 2: Descubriendo historias
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
          </div>
          
          {/* Barra de progreso */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-amber-800">
              <span>Progreso de la dinámica</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-amber-200/50 rounded-full overflow-hidden">
              <div 
                style={{ width: `${progressPercent}%` }} 
                className="h-full bg-amber-600 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Cuerpo Principal */}
        <div className="p-6 flex-1 min-h-[350px] flex flex-col justify-between bg-amber-50/10">

          {/* MODO 1: SELECCIÓN DE ACCIÓN (Leer, Escuchar, Animación) */}
          {mode === 'select' && (
            <div className="text-center space-y-6 my-auto">
              <h3 className="text-2xl font-bold text-gray-800">Conoce la historia de {activeStory.name}</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Elige cómo deseas descubrir esta inspiradora experiencia vivida en el Patinódromo.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => setMode('read')}
                  className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-xl hover:bg-amber-50/50 hover:border-amber-400 transition group"
                >
                  <BookOpen className="h-8 w-8 text-amber-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">Leer historia</span>
                </button>

                <button
                  onClick={() => { setMode('audio'); handlePlayAudio(); }}
                  className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-xl hover:bg-amber-50/50 hover:border-amber-400 transition group"
                >
                  <Volume2 className="h-8 w-8 text-amber-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">Escuchar audio</span>
                </button>

                <button
                  onClick={() => setMode('animation')}
                  className="flex flex-col items-center p-5 bg-white border border-amber-200 rounded-xl hover:bg-amber-50/50 hover:border-amber-400 transition group"
                >
                  <Play className="h-8 w-8 text-amber-600 mb-2 group-hover:scale-110 transition" />
                  <span className="font-bold text-sm">Mini animación</span>
                </button>
              </div>
            </div>
          )}

          {/* MODO 2: LEER HISTORIA */}
          {mode === 'read' && (
            <div className="space-y-4 my-auto">
              <h3 className="text-lg font-bold text-amber-800 border-b pb-2">{activeStory.title}</h3>
              <p className="text-gray-700 leading-relaxed text-sm max-h-[220px] overflow-y-auto pr-2">
                {activeStory.text}
              </p>
              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setMode('quiz')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 text-sm shadow transition"
                >
                  Ir a la pregunta <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* MODO 3: AUDIO */}
          {mode === 'audio' && (
            <div className="text-center space-y-6 my-auto">
              <h3 className="text-xl font-bold text-gray-800">Escuchando la historia de {activeStory.name}</h3>
              
              <div className="flex justify-center">
                <div className="relative w-24 h-24 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center anim-grow">
                  {isSpeaking ? (
                    <Volume2 className="h-10 w-10 text-amber-600" />
                  ) : (
                    <StopCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handlePlayAudio}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
                >
                  {isSpeaking ? "Pausar Audio" : "Escuchar de nuevo"}
                </button>
                <p className="text-xs text-gray-500">Haz clic para controlar la reproducción de la historia.</p>
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setMode('quiz');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 text-sm shadow transition"
                >
                  Ir a la pregunta <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* MODO 4: MINI ANIMACIÓN CON CÓDIGO (SVG + CSS) */}
          {mode === 'animation' && (
            <div className="text-center space-y-4 my-auto">
              <h3 className="text-lg font-bold text-gray-800">{activeStory.title}</h3>
              
              {/* Contenedor del lienzo de animación */}
              <div className="w-full max-w-md h-40 mx-auto bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                
                {/* ANIMACIÓN 1: JUAN (Amigos y huellas flotantes) */}
                {activeStory.id === 1 && (
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center anim-float">
                      <Smile className="h-12 w-12 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">Juan</span>
                    </div>
                    <div className="text-3xl anim-grow">🤝</div>
                    <div className="flex flex-col items-center anim-float" style={{ animationDelay: '1.5s' }}>
                      <Smile className="h-12 w-12 text-blue-600" />
                      <span className="text-xs font-bold text-blue-800">Amigos</span>
                    </div>
                  </div>
                )}

                {/* ANIMACIÓN 2: MARÍA (Estrella creciendo y brillando) */}
                {activeStory.id === 2 && (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Sparkles className="h-16 w-16 text-yellow-500 anim-grow" />
                    <span className="text-xs font-bold text-amber-800">María descubrió su capacidad</span>
                  </div>
                )}

                {/* ANIMACIÓN 3: ANDRÉS (Reloj de arena y corredor) */}
                {activeStory.id === 3 && (
                  <div className="flex flex-col items-center justify-center space-y-2 w-full px-10">
                    <div className="flex justify-between w-full text-3xl anim-run">
                      <span>🏃‍♂️</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 anim-grow w-3/4" />
                    </div>
                    <span className="text-xs font-bold text-amber-800">Esfuerzo y Disciplina</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setMode('quiz')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 text-sm shadow transition"
                >
                  Ir a la pregunta <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* MODO 5: PREGUNTA (QUIZ) */}
          {mode === 'quiz' && (
            <div className="space-y-4 my-auto">
              <h3 className="text-lg font-bold text-gray-800 text-center">{activeStory.question}</h3>
              
              <div className="space-y-2 max-w-md mx-auto">
                {activeStory.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition ${
                      selectedAnswer === idx
                        ? idx === activeStory.correctAnswer
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                          : "bg-red-50 border-red-400 text-red-900"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2">{String.fromCharCode(65 + idx)})</span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Pantalla de éxito en la respuesta */}
              {selectedAnswer !== null && quizSuccess && (
                <div className="bg-emerald-50 border border-emerald-400 p-4 rounded-xl text-center space-y-2 max-w-md mx-auto">
                  <h4 className="font-bold text-emerald-800 flex items-center justify-center gap-2">
                    🏅 ¡Muy bien!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    {activeStoryIdx < STORIES.length - 1 
                      ? "Has desbloqueado la siguiente historia." 
                      : "¡Has completado todas las historias del Patinódromo!"}
                  </p>
                  
                  <button
                    onClick={handleNextStory}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg text-xs transition"
                  >
                    {activeStoryIdx < STORIES.length - 1 ? "Ver siguiente historia" : "Finalizar Dinámica"}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Selector de historias en el pie */}
        <div className="bg-slate-50 p-4 border-t flex justify-center gap-2">
          {STORIES.map((s, idx) => {
            const isUnlocked = idx <= unlockedIdx;
            return (
              <button
                key={s.id}
                disabled={!isUnlocked}
                onClick={() => {
                  setActiveStoryIdx(idx);
                  setMode('select');
                  setSelectedAnswer(null);
                  setQuizSuccess(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeStoryIdx === idx
                    ? "bg-amber-600 text-white"
                    : isUnlocked
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {!isUnlocked && <Lock className="h-3 w-3" />}
                {s.name}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}