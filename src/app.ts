import express, {Request, Response } from "express"
import {cadastrarClientes, exibirClientes, exibirClienteID, atualizarCliente, removerCliente, exibirNotasCliente} from "./controllers/clienteController"
import {cadastrarVendedores, exibirVendedores, exibirVendedorID, atualizarVendedor, removerVendedor, exibirNotasVendedor} from "./controllers/vendedorController"
import {cadastrarCarros, exibirCarros, exibirCarroID, atualizarCarro, exibirCarrosDisponiveis, removerCarro} from "./controllers/carroController"
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
app.get('/clientes/notas/:id', exibirNotasCliente)
app.post('/clientes', cadastrarClientes)
app.get('/clientes/:id', exibirClienteID)
app.put('/clientes/:id', atualizarCliente)
app.delete('/clientes/:id', removerCliente)

//Rotas Vendedores
app.get('/vendedores', exibirVendedores)
app.get('/vendedores/notas/:id', exibirNotasVendedor)
app.post('/vendedores', cadastrarVendedores)
app.get('/vendedores/:id', exibirVendedorID)
app.put('/vendedores/:id', atualizarVendedor)
app.delete('/vendedores/:id', removerVendedor)

// Rotas Carros
app.get('/carros', exibirCarros)
app.get('/carros/disponiveis', exibirCarrosDisponiveis)
app.post('/carros', cadastrarCarros)
app.get('/carros/:id', exibirCarroID)
app.put('/carros/:id', atualizarCarro)
app.delete('/carros/:id', removerCarro)


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

