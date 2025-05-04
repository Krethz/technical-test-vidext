import { z } from "zod";
import { publicProcedure } from "@/server/api/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AZURE_AI_API_KEY,
});

export const describeDrawing = publicProcedure
  .input(z.object({ store: z.any() }))
  .mutation(async ({ input }) => {
    try {
      const response = await openai.chat.completions.create({
        model: `${process.env.AZURE_DEPLOYMENT_NAME}`,
        messages: [
          {
            role: "system",
            content:
              "Describe un dibujo a partir del JSON del store de Tldraw.",
          },
          {
            role: "user",
            content: `Describe este dibujo: ${JSON.stringify(
              input.store.document.store
            )}`,
          },
        ],
      });

      return {
        description:
          response.choices[0].message.content ?? "No description generated.",
      };
    } catch (error) {
      console.error("Error de OpenAI:", error);
      throw new Error("Error al procesar la solicitud de OpenAI.");
    }
  });
