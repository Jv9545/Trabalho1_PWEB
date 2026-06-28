import { Request, Response } from "express";
import { NotaFiscalService } from "../services/notaFiscalService";

export class NotaFiscalController {
    private notaFiscalServico = new NotaFiscalService();

    async emitirNotaFiscal(req: Request, res: Response) {
        try {
            const novaNota = await this.notaFiscalServico.emitirNota(req.body);
            return res.status(201).json({
                mensagem: "Nota fiscal emitida com sucesso!",
                NotaFiscal: novaNota
            });
        } catch (error: any) {
            if (error.message === "Número da nota já existente") {
                return res.status(409).json({ message: error.message });
            } else if (error.message === "Estoque insuficiente") {
                return res.status(422).json({ message: error.message });
            } else if (error.message.includes("não encontrado")) {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async exibirNotasFiscais(req: Request, res: Response) {
        try {
            const notas = await this.notaFiscalServico.listar();
            return res.status(200).json(notas);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async exibirNotaFiscalID(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const nota = await this.notaFiscalServico.listarID(id);
            return res.status(200).json({
                mensagem: "Nota fiscal encontrada:",
                NotaFiscal: nota
            });
        } catch (error: any) {
            if (error.message === "Nota fiscal não encontrada") {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}