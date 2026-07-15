// lib/momento-data.ts

export interface Historia {
  id: number
  texto: string
  categoria: string
  explicacion: string
}

export const CATEGORIAS = [
  "Bienestar",
  "Convivencia",
  "Liderazgo",
  "Disciplina",
  "Proyecto de vida",
  "Salud mental",
  "Inclusión",
] as const

export const HISTORIAS: Historia[] = [
  {
    id: 1,
    texto: "Una joven encontró amigos que la apoyan y con quienes comparte cada fin de semana.",
    categoria: "Convivencia",
    explicacion: "Compartir espacios y actividades con otros jóvenes fortalece los lazos de comunidad.",
  },
  {
    id: 2,
    texto: "Un joven aprendió a organizar su tiempo entre el estudio, el trabajo y el deporte.",
    categoria: "Disciplina",
    explicacion: "Organizar el tiempo y mantener una rutina es un ejercicio constante de disciplina.",
  },
  {
    id: 3,
    texto: "Un grupo de patinadores decidió liderar una actividad para todo el barrio.",
    categoria: "Liderazgo",
    explicacion: "Tomar la iniciativa y guiar a otros hacia una meta común es liderazgo en acción.",
  },
  {
    id: 4,
    texto: "Una joven con una condición de movilidad se sintió parte del grupo por primera vez.",
    categoria: "Inclusión",
    explicacion: "Un espacio es realmente valioso cuando todos, sin excepción, se sienten parte de él.",
  },
  {
    id: 5,
    texto: "Un joven descubrió que quiere estudiar Educación Física en la universidad.",
    categoria: "Proyecto de vida",
    explicacion: "Descubrir una vocación es un paso enorme en la construcción del proyecto de vida.",
  },
  {
    id: 6,
    texto: "Una joven aprendió a respirar y calmarse antes de una competencia importante.",
    categoria: "Salud mental",
    explicacion: "Aprender a manejar la ansiedad y el estrés es cuidar la salud mental.",
  },
  {
    id: 7,
    texto: "Un joven mejoró su energía, su ánimo y su autoestima gracias al ejercicio constante.",
    categoria: "Bienestar",
    explicacion: "El movimiento y el deporte son motores directos del bienestar físico y emocional.",
  },
]
