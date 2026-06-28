import { Router, Request, Response } from 'express';
import { CarroController } from '../controllers/carroController';
import { ClienteController } from '../controllers/clienteController';

const router = Router();
const carroController = new CarroController();
const clienteController = new ClienteController();

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


export default router;