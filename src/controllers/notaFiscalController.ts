import { Request, Response } from "express";
import { NotaFiscalService } from "../services/notaFiscalService";

const notaFiscalServico = new NotaFiscalService();

export function emitirNotaFiscal(req: Request, res: Response) {
    try {
        const novaNota = notaFiscalServico.emitirNota(req.body);
        res.status(201).json({
            mensagem: "Nota fiscal emitida com sucesso!",
            NotaFiscal: novaNota
        });
    } catch (error: any) {
        if (error.message === "Número da nota já existente") {
            res.status(409).json({ message: error.message });
        } else if (error.message === "Estoque insuficiente") {
            res.status(422).json({ message: error.message });
        } else if (error.message.includes("não encontrado")) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

export function exibirNotasFiscais(req: Request, res: Response) {
    try {
        res.status(200).json(notaFiscalServico.listar());
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export function exibirNotaFiscalID(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const nota = notaFiscalServico.listarID(id);
        res.status(200).json({
            mensagem: "Nota fiscal encontrada:",
            NotaFiscal: nota
        });
    } catch (error: any) {
        if (error.message === "Nota fiscal não encontrada") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}