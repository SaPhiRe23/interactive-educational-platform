// app/actions/ideas.ts
'use server';

import { db } from "@/lib/db"
import { ideas } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Obtener todas las ideas (usadas tanto en el muro del Momento 5 como en la votación del Momento 6)
export async function getIdeas() {
  try {
    return await db.select().from(ideas).orderBy(desc(ideas.createdAt));
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return [];
  }
}

// Agregar una nueva propuesta (Momento 5)
export async function addIdea(reto: string, texto: string) {
  try {
    await db.insert(ideas).values({ reto, texto });

    revalidatePath('/mapa');
    return { success: true };
  } catch (error) {
    console.error("Error adding idea:", error);
    return { success: false, error: "No se pudo guardar la propuesta" };
  }
}

// Votar por una propuesta existente (Momento 6)
export async function voteIdea(id: number) {
  try {
    const [current] = await db.select().from(ideas).where(eq(ideas.id, id));
    if (!current) return { success: false, error: "La propuesta ya no existe" };

    await db.update(ideas).set({ votos: current.votos + 1 }).where(eq(ideas.id, id));

    revalidatePath('/mapa');
    return { success: true };
  } catch (error) {
    console.error("Error voting idea:", error);
    return { success: false, error: "No se pudo registrar el voto" };
  }
}

// Eliminar una propuesta (Para el panel de administración)
export async function deleteIdea(id: number) {
  try {
    await db.delete(ideas).where(eq(ideas.id, id));
    revalidatePath('/admin/mapa');
    revalidatePath('/mapa');
    return { success: true };
  } catch (error) {
    console.error("Error deleting idea:", error);
    return { success: false };
  }
}
