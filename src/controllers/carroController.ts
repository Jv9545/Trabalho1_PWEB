import { Request, Response } from "express";
import { CarroService } from "../services/carroService";

export class CarroController {
    private carroServico = new CarroService();

    async cadastrarCarros(req: Request, res: Response) {
        try {
            const novoCarro = await this.carroServico.cadastrarCarro(req.body);
            return res.status(201).json({
                mensagem: "Carro cadastrado com sucesso!",
                Novocliente: novoCarro
            });
        } catch (error: any) {
            if (error.message === "Placa já cadastrada") {
                return res.status(409).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async exibirCarros(req: Request, res: Response) {
        try {
            const carros = await this.carroServico.listar();
            return res.status(200).json(carros);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async exibirCarroID(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const carro = await this.carroServico.listarID(id);
            return res.status(200).json({
                mensagem: "Carro encontrado:",
                Cliente: carro
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async atualizarCarro(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const carroAtualizado = await this.carroServico.atualizar(id, req.body);
            return res.status(200).json({
                mensagem: "Carro atualizado com sucesso!",
                Cliente: carroAtualizado
            });
        } catch (error: any) {
            if (error.message === "ID não encontrado") {
                return res.status(404).json({ message: error.message });
            } else if (error.message === "Placa já cadastrada") {
                return res.status(409).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async exibirCarrosDisponiveis(req: Request, res: Response) {
        try {
            const disponiveis = await this.carroServico.listarDisponiveis();
            return res.status(200).json(disponiveis);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async removerCarro(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.carroServico.remover(id);
            return res.status(200).json({ mensagem: "Carro removido com sucesso!" });
        } catch (error: any) {
            if (error.message === "Carro não encontrado") {
                return res.status(404).json({ message: error.message });
            } else if (error.message.includes("Não é possível remover")) {
                return res.status(422).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}