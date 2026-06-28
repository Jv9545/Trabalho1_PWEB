import express, { Request, Response } from "express";
import router from "./routes/router";
import { inicializarBanco } from "./database/mysql";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use(router);

async function startServer() {
    try {
        await inicializarBanco();
        
        app.listen(PORT, () => {
            console.log(`API em execução no URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Falha ao iniciar o servidor:", error);
    }
}

startServer();