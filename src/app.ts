import express, {Request, Response } from "express"
import {cadastrarClientes, exibirClientes, exibirClientesID, atualizarCliente} from "./controllers/clienteController"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

function helloWord(req: Request, res: Response): void{
    res.status(200).send('Hello Word!!!')
} 

app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`))

//Teste
app.get('/api/hello', helloWord)

//Rotas Clientes
app.get('/clientes', exibirClientes)
app.post('/clientes', cadastrarClientes)
app.get('/clientes/:id', exibirClientesID)
app.put('/clientes/:id', atualizarCliente)
