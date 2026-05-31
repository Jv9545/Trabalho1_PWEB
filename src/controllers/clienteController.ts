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

export function exibirClientesID (req:Request, res:Response){
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