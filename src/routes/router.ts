import { Router, Request, Response } from 'express';
import { CarroController } from '../controllers/carroController';
import { ClienteController } from '../controllers/clienteController';
import { EstoqueController } from '../controllers/estoqueController';
import { NotaFiscalController } from '../controllers/notaFiscalController';

const router = Router();
const carroController = new CarroController();
const clienteController = new ClienteController();
const estoqueController = new EstoqueController();
const notaFiscalController = new NotaFiscalController();

// --- Rota Teste ----
router.get('/api/hello', (req: Request, res: Response): void => {
    res.status(200).send('Hello Word!!!');
});



// --- Rotas Carros ---
router.get('/carros/disponiveis', (req: Request, res: Response) => { carroController.exibirCarrosDisponiveis(req, res); });
router.get('/carros', (req: Request, res: Response) => { carroController.exibirCarros(req, res); });
router.post('/carros', (req: Request, res: Response) => { carroController.cadastrarCarros(req, res); });
router.get('/carros/:id', (req: Request, res: Response) => { carroController.exibirCarroID(req, res); });
router.put('/carros/:id', (req: Request, res: Response) => { carroController.atualizarCarro(req, res); });
router.delete('/carros/:id', (req: Request, res: Response) => { carroController.removerCarro(req, res); });

// --- Rotas Clientes ---
router.get('/clientes/notas/:id', (req: Request, res: Response) => { clienteController.exibirNotasCliente(req, res); });
router.get('/clientes', (req: Request, res: Response) => { clienteController.exibirClientes(req, res); });
router.post('/clientes', (req: Request, res: Response) => { clienteController.cadastrarClientes(req, res); });
router.get('/clientes/:id', (req: Request, res: Response) => { clienteController.exibirClienteID(req, res); });
router.put('/clientes/:id', (req: Request, res: Response) => { clienteController.atualizarCliente(req, res); });
router.delete('/clientes/:id', (req: Request, res: Response) => { clienteController.removerCliente(req, res); });

// --- Rotas Estoque ---
router.get('/estoques/carro/:id_carro', (req: Request, res: Response) => { estoqueController.exibirEstoqueCarroID(req, res); });
router.get('/estoques', (req: Request, res: Response) => { estoqueController.exibirEstoques(req, res); });
router.post('/estoques', (req: Request, res: Response) => { estoqueController.cadastrarEstoques(req, res); });
router.get('/estoques/:id', (req: Request, res: Response) => { estoqueController.exibirEstoqueID(req, res); });
router.put('/estoques/:id', (req: Request, res: Response) => { estoqueController.atualizarEstoque(req, res); });
router.delete('/estoques/:id', (req: Request, res: Response) => { estoqueController.removerEstoque(req, res); });

// --- Rotas Nota Fiscal ---
router.get('/notas', (req: Request, res: Response) => { notaFiscalController.exibirNotasFiscais(req, res); });
router.post('/notas', (req: Request, res: Response) => { notaFiscalController.emitirNotaFiscal(req, res); });
router.get('/notas/:id', (req: Request, res: Response) => { notaFiscalController.exibirNotaFiscalID(req, res); });

export default router;