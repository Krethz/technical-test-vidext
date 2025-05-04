import { router } from "../api/trpc";
import { drawingsRouter } from "../api/routers/drawings";
import { describeDrawing } from "./routers/describe";

export const appRouter = router({
  drawings: drawingsRouter,
  describe: describeDrawing,
});

export type AppRouter = typeof appRouter;
