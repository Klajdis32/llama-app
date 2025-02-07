import express from "express";
import dotenv from 'dotenv';
import llamaRoute from "./routes/llama.js";
import cors from "cors";

dotenv.config();
const app = express()

app.use(cors());

app.use(express.json())

app.use((err, req, res, next) => {
    console.error('Error middleware triggered:', err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.use("/api/llamaReq" , llamaRoute);

app.listen(8081, ()=> {
    console.log("listening");
})
