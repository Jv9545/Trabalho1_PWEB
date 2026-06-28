import { Request, Response } from "express";
import { ClienteService } from "../services/ClienteService";

export class ClienteController {
    private clienteServico = new ClienteService();

    async cadastrarClientes(req: Request, res: Response) {
        try {
            const novoCliente = await this.clienteServico.cadastrarCliente(req.body);
            return res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso!",
                Novocliente: novoCliente
            });
        } catch (error: any) {
            return res.status(409).json({ message: error.message });
        }
    }

    async exibirClientes(req: Request, res: Response) {
        try {
            const clientes = await this.clienteServico.listar();
            return res.status(200).json(clientes);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async exibirClienteID(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const cliente = await this.clienteServico.listarID(id);
            return res.status(200).json({
                mensagem: "Cliente encontrado:",
                Cliente: cliente
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async atualizarCliente(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const clienteAtualizado = await this.clienteServico.atualizar(id, req.body);
            return res.status(200).json({
                mensagem: "Cliente atualizado com sucesso!",
                Cliente: clienteAtualizado
            });
        } catch (error: any) {
            if (error.message === "ID não encontrado") {
                return res.status(404).json({ message: error.message });
            } else if (error.message === "Este CPF já está registado outro cliente") {
                return res.status(409).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async removerCliente(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.clienteServico.remover(id);
            return res.status(200).json({ mensagem: "Cliente removido com sucesso!" });
        } catch (error: any) {
            if (error.message === "Cliente não encontrado") {
                return res.status(404).json({ message: error.message });
            } else if (error.message.includes("Não é possível remover")) {
                return res.status(422).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    async exibirNotasCliente(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const notas = await this.clienteServico.listarNotas(id);
            return res.status(200).json(notas);
        } catch (error: any) {
            if (error.message === "Cliente não encontrado") {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}