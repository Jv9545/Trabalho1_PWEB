import { Request, Response } from "express";
import { EstoqueService } from "../services/estoqueService";

export class EstoqueController {
    private estoqueServico = new EstoqueService();

    async cadastrarEstoques(req: Request, res: Response) {
        try {
            const novoEstoque = await this.estoqueServico.cadastrarEstoque(req.body);
            return res.status(201).json({
                mensagem: "Estoque cadastrado com sucesso!",
                NovoEstoque: novoEstoque
            });
        } catch (error: any) {
            if (error.message === "Carro não existe") {
                return res.status(404).json({ message: error.message });
            } else if (error.message === "Carro já possui registro de estoque") {
                return res.status(409).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async exibirEstoques(req: Request, res: Response) {
        try {
            const estoques = await this.estoqueServico.listar();
            return res.status(200).json(estoques);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async exibirEstoqueID(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const estoque = await this.estoqueServico.listarID(id);
            return res.status(200).json({
                mensagem: "Estoque encontrado:",
                Estoque: estoque
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async exibirEstoqueCarroID(req: Request, res: Response) {
        try {
            const id_carro = req.params.id_carro;
            const estoque = await this.estoqueServico.listarEstoqueCarroID(id_carro);
            return res.status(200).json({
                mensagem: `Estoque carro ${id_carro} encontrado:`,
                Estoque: estoque
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async atualizarEstoque(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const estoqueAtualizado = await this.estoqueServico.atualizar(id, req.body);
            return res.status(200).json({
                mensagem: "Estoque atualizado com sucesso!",
                Estoque: estoqueAtualizado
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async removerEstoque(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.estoqueServico.remover(id);
            return res.status(200).json({ mensagem: "Estoque removido com sucesso!" });
        } catch (error: any) {
            if (error.message === "Estoque não encontrado") {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}