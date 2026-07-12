export const QUESTION_TYPES = [
  { value: "stars", label: "Estrellas (1 a 5)" },
  { value: "yesno", label: "Sí / No" },
  { value: "single_choice", label: "Opción única" },
  { value: "multi_choice", label: "Varias opciones" },
  { value: "text", label: "Texto libre" },
] as const

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"]

export const CHART_TYPES = [
  { value: "bar", label: "Barras" },
  { value: "donut", label: "Dona" },
  { value: "table", label: "Tabla" },
] as const

export type ChartType = (typeof CHART_TYPES)[number]["value"]

export const DEFAULT_SURVEY_QUESTIONS: {
  label: string
  type: QuestionType
  options?: string[]
  helperMin?: string
  helperMax?: string
  required?: boolean
}[] = [
  {
    label: "¿Era la primera vez que participabas en una actividad en el Patinódromo?",
    type: "yesno",
  },
  {
    label: "¿Qué tanto disfrutaste la actividad?",
    type: "stars",
    helperMin: "Nada",
    helperMax: "Muchísimo",
  },
  {
    label: "¿Las actividades fueron fáciles de entender?",
    type: "stars",
    helperMin: "Nada",
    helperMax: "Muchísimo",
  },
  {
    label: "¿Qué momento te gustó más?",
    type: "single_choice",
    options: [
      "Mi huella en la ciudad",
      "Descubriendo historias",
      "Corre a tu respuesta",
      "Construyendo el mapa de oportunidades",
      "El reto del futuro",
    ],
  },
  {
    label: "¿Te sentiste escuchado y pudiste participar?",
    type: "single_choice",
    options: ["Sí", "No", "Parcialmente"],
  },
  {
    label:
      "Después de esta actividad considero que el Patinódromo es un espacio que ayuda a los jóvenes a desarrollar:",
    type: "multi_choice",
    options: [
      "Bienestar",
      "Liderazgo",
      "Disciplina",
      "Convivencia",
      "Inclusión",
      "Salud mental",
      "Proyecto de vida",
      "Todas las anteriores",
    ],
  },
  {
    label: "Escribe una frase que describa lo que representa para ti el Patinódromo después de esta experiencia.",
    type: "text",
    required: false,
  },
]
