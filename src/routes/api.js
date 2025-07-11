import express from "express";
import mikrotikRouter from "./mikrotik";

const apiRouter = express.Router();
apiRouter.use(mikrotikRouter);

export default apiRouter;
