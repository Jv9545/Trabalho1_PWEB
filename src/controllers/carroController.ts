import {Request, Response } from "express"
import { CarroService } from "../services/carroService"
const carroServico = new CarroService();

export function cadastrarCarros (req:Request, res:Response){
    try{
        const novoCarro = carroServico.cadastrarCarro(req.body)
        res.status(201).json(
            {
            mensagem:"Carro cadastrado com sucesso!",
            Novocliente:novoCarro
            }
        )
    } catch(error:any){
        if (error.message === "Placa já cadastrada"){
            res.status(409).json({ message: error.message })
        }else{
            res.status(400).json({ message: error.message })
        }
    }
}

export function exibirCarros (req:Request, res:Response){
    try{
        res.status(200).json(carroServico.listar())
    }catch(error:any){
        res.status(400).json({message: error.message})
    }
}

export function exibirCarroID (req:Request, res:Response){
    try{
        const id = req.params.id
        const carro = carroServico.listarID(id)
        res.status(200).json(
            {
                mensagem:"Cliente encontrado:",
                Cliente:carro
            }
        )
    }catch(error:any){
        res.status(404).json({message: error.message})
    }
}

export function atualizarCarro(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const carroAtualizado = carroServico.atualizar(id, req.body);
        
        res.status(200).json({
            mensagem: "Cliente atualizado com sucesso!",
            Cliente: carroAtualizado
        });
    } catch (error: any) {
        if (error.message === "ID não encontrado") {
            res.status(404).json({ message: error.message })
        } else if (error.message === "Placa já cadastrada"){
            res.status(409).json({ message: error.message })
        }else{
            res.status(400).json({ message: error.message })
        }
    }
}

export function exibirCarrosDisponiveis(req: Request, res: Response) {
    try {
        res.status(200).json(carroServico.listarDisponiveis());
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export function removerCarro(req: Request, res: Response) {
    try {
        const id = req.params.id;
        carroServico.remover(id);
        
        res.status(200).json({ mensagem: "Carro removido com sucesso!" });
    } catch (error: any) {
        if (error.message === "Carro não encontrado") {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Não é possível remover")) {
            res.status(422).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

