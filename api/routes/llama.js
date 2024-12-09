import express from "express";
import { request } from "../controllers/llama.js";

const router = express.Router();

router.post("/request", request);

export default router;