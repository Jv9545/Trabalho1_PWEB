import express, {Request, Response } from "express"
import {cadastrarClientes, exibirClientes, exibirClienteID, atualizarCliente} from "./controllers/clienteController"
import {cadastrarVendedores, exibirVendedores, exibirVendedorID, atualizarVendedor} from "./controllers/vendedorController"
import {cadastrarCarros, exibirCarros, exibirCarroID, atualizarCarro} from "./controllers/carroController"
import {cadastrarEstoques, exibirEstoques, exibirEstoqueID, atualizarEstoque, removerEstoque, exibirEstoqueCarroID} from "./controllers/estoqueController"
import { emitirNotaFiscal, exibirNotasFiscais, exibirNotaFiscalID } from "./controllers/notaFiscalController"

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
app.get('/clientes/:id', exibirClienteID)
app.put('/clientes/:id', atualizarCliente)

//Rotas Vendedores
app.get('/vendedores', exibirVendedores)
app.post('/vendedores', cadastrarVendedores)
app.get('/vendedores/:id', exibirVendedorID)
app.put('/vendedores/:id', atualizarVendedor)

//Rotas Carros
app.get('/carros', exibirCarros)
app.post('/carros', cadastrarCarros)
app.get('/carros/:id', exibirCarroID)
app.put('/carros/:id', atualizarCarro)


//Rotas Estoques
app.post('/estoques', cadastrarEstoques)
app.get('/estoques', exibirEstoques)
app.get('/estoques/:id', exibirEstoqueID)
app.get('/estoques/carro/:id_carro', exibirEstoqueCarroID)
app.put('/estoques/:id', atualizarEstoque)
app.delete('/estoques/:id', removerEstoque)

//Rotas NotaFical
app.post('/notas', emitirNotaFiscal)
app.get('/notas', exibirNotasFiscais)
app.get('/notas/:id', exibirNotaFiscalID)

