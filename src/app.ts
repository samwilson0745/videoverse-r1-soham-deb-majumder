import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import ingestionRouter from "./routes/ingest";
import articleRouter from "./routes/article";
const app: Express = express();

// --------------- Middleware ---------------
app.use(express.json());
app.use(morgan("dev"));

// --------------- Routes ---------------
app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/", ingestionRouter);
app.use("/api/", articleRouter);

// define your routes 

export default app;
