"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRatingInput({
  name,
  helperMin,
  helperMax,
  defaultValue = 0,
}: {
  name: string
  helperMin?: string | null
  helperMax?: string | null
  defaultValue?: number
}) {
  const [value, setValue] = useState(defaultValue)
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div className="flex flex-col gap-1.5">
      <input type="hidden" name={name} value={value || ""} />
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(n)}
            onMouseEnter={() => setHover(n)}
            className="rounded p-0.5 transition-transform hover:scale-110"
            aria-label={`${n} de 5 estrellas`}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                active >= n ? "fill-primary text-primary" : "fill-transparent text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
      {(helperMin || helperMax) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 = {helperMin || "Nada"}</span>
          <span>5 = {helperMax || "Muchísimo"}</span>
        </div>
      )}
    </div>
  )
}
