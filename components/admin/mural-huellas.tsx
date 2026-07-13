'use server';

import { db } from "@/lib/db"
import { huellas } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Obtener todas las huellas para el mural
export async function getHuellas() {
  try {
    return await db.select().from(huellas).orderBy(desc(huellas.createdAt));
  } catch (error) {
    console.error("Error fetching huellas:", error);
    return [];
  }
}

// Agregar una nueva huella con simulación de óvalo (Patinódromo)
export async function addHuella(texto: string) {
  try {
    // Generamos posiciones aleatorias que simulan la forma ovalada del patinódromo
    const angle = Math.random() * Math.PI * 2;
    const rx = 35 + Math.random() * 10; // Radio en X (óvalo horizontal)
    const ry = 20 + Math.random() * 5;  // Radio en Y (óvalo vertical)
    const posX = 50 + rx * Math.cos(angle);
    const posY = 50 + ry * Math.sin(angle);

    await db.insert(huellas).values({
      texto,
      posX, // Almacena decimales de tipo "real"
      posY,
    });

    revalidatePath('/mapa');
    return { success: true };
  } catch (error) {
    console.error("Error adding huella:", error);
    return { success: false, error: "No se pudo guardar la huella" };
  }
}

// Eliminar huella (Para el panel de administración)
export async function deleteHuella(id: number) {
  try {
    await db.delete(huellas).where(eq(huellas.id, id));
    revalidatePath('/admin/mapa');
    revalidatePath('/mapa');
    return { success: true };
  } catch (error) {
    console.error("Error deleting huella:", error);
    return { success: false };
  }
}