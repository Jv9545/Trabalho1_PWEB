import {Request, Response } from "express"
import { ClienteService } from "../services/ClienteService"
const clienteServico = new ClienteService();

export function cadastrarClientes (req:Request, res:Response){
    try{
        const novoCliente = clienteServico.cadastrarCliente(req.body)
        res.status(201).json(
            {
            mensagem:"Cliente cadastrado com sucesso!",
            cliente:novoCliente
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