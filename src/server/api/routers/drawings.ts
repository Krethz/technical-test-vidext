import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import path from "path";
import fs from "fs";
import { Drawing } from "@/lib/types/Drawing";

const DRAWINGS_DIR = path.join(process.cwd(), "snapshots");

if (!fs.existsSync(DRAWINGS_DIR)) {
  fs.mkdirSync(DRAWINGS_DIR, { recursive: true });
}

const getDrawingPath = (id: string) => path.join(DRAWINGS_DIR, `${id}.json`);

const saveDrawing = (drawing: Drawing) => {
  fs.writeFileSync(
    getDrawingPath(drawing.id),
    JSON.stringify(drawing, null, 2)
  );
  return drawing;
};

const readDrawing = (id: string): Drawing | null => {
  const filePath = getDrawingPath(id);
  if (!fs.existsSync(filePath)) return null;

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading drawing ${id}:`, error);
    return null;
  }
};

const getAllDrawings = (): Drawing[] => {
  try {
    const drawings = fs
      .readdirSync(DRAWINGS_DIR)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const id = file.replace(".json", "");
        const drawing = readDrawing(id);
        return drawing;
      })
      .filter((drawing): drawing is Drawing => drawing !== null)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    return drawings;
  } catch (error) {
    console.error("Error reading drawings:", error);
    return [];
  }
};

const deleteDrawing = (id: string): boolean => {
  const filePath = getDrawingPath(id);
  if (!fs.existsSync(filePath)) return false;

  try {
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting drawing ${id}:`, error);
    return false;
  }
};

const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const drawingsRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const drawings = getAllDrawings();
      return drawings;
    } catch (error) {
      console.error("Error in getAll procedure:", error);
      return [];
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return readDrawing(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        data: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const now = new Date().toISOString();
      const drawing: Drawing = {
        id: generateId(),
        name: input.name,
        data: input.data,
        createdAt: now,
        updatedAt: now,
      };

      return saveDrawing(drawing);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        data: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = readDrawing(input.id);
      if (!existing) {
        throw new Error(`Drawing with id ${input.id} not found`);
      }

      const updated: Drawing = {
        ...existing,
        name: input.name,
        data: input.data,
        updatedAt: new Date().toISOString(),
      };

      return saveDrawing(updated);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const success = deleteDrawing(input.id);
      if (!success) {
        throw new Error(`Failed to delete drawing with id ${input.id}`);
      }
      return { success: true };
    }),
});
