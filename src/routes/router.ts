import { Router, Request, Response } from 'express';
import { CarroController } from '../controllers/carroController';

const router = Router();
const carroController = new CarroController();

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

export default router;