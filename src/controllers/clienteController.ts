import {Request, Response } from "express"
import { ClienteService } from "../services/ClienteService"
const clienteServico = new ClienteService();

export function cadastrarClientes (req:Request, res:Response){
    try{
        const novoCliente = clienteServico.cadastrarCliente(req.body)
        res.status(201).json(
            {
            mensagem:"Cliente cadastrado com sucesso!",
            Novocliente:novoCliente
            }
        )
    } catch(error:any){
        res.status(409).json({message: error.message})
    }
}

export function exibirClientes (req:Request, res:Response){
    try{
        res.status(200).json(clienteServico.listar())
    }catch(error:any){
        res.status(400).json({message: error.message})
    }
}

export function exibirClienteID (req:Request, res:Response){
    try{
        const id = req.params.id
        const cliente = clienteServico.listarID(id)
        res.status(200).json(
            {
                mensagem:"Cliente encontrado:",
                Cliente:cliente
            }
        )
    }catch(error:any){
        res.status(404).json({message: error.message})
    }
}

export function atualizarCliente(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const clienteAtualizado = clienteServico.atualizar(id, req.body);
        
        res.status(200).json({
            mensagem: "Cliente atualizado com sucesso!",
            Cliente: clienteAtualizado
        });
    } catch (error: any) {
        if (error.message === "ID não encontrado") {
            res.status(404).json({ message: error.message })
        } else if (error.message === "Este CPF já está registado outro cliente"){
            res.status(409).json({ message: error.message })
        }else{
            res.status(400).json({ message: error.message })
        }
    }
}

export function removerCliente(req: Request, res: Response) {
    try {
        const id = req.params.id;
        clienteServico.remover(id);
        
        res.status(200).json({ mensagem: "Cliente removido com sucesso!" });
    } catch (error: any) {
        if (error.message === "Cliente não encontrado") {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Não é possível remover")) {
            res.status(422).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

export function exibirNotasCliente(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const notas = clienteServico.listarNotas(id);
        
        res.status(200).json(notas);
    } catch (error: any) {
        if (error.message === "Cliente não encontrado") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

