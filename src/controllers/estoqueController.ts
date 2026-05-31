import {Request, Response } from "express"
import { EstoqueService } from "../services/estoqueService"
const estoqueServico = new EstoqueService();

export function cadastrarEstoques (req:Request, res:Response){
    try{
        const novoEstoque = estoqueServico.cadastrarEstoque(req.body)
        res.status(201).json(
            {
            mensagem:"Estoque cadastrado com sucesso!",
            NovoEstoque:novoEstoque
            }
        )
    } catch(error:any){
        if(error.message === "Carro não existe"){
            res.status(404).json({message: error.message})
        }else if(error.message === "Carro já possui registro de estoque"){
            res.status(409).json({message: error.message})
        }
        else{
            res.status(400).json({message: error.message})
        }

    }
}

export function exibirEstoques ( req:Request, res: Response){
    try{
        res.status(200).json(estoqueServico.listar())
    }catch(error:any){
        res.status(400).json({message: error.message})
    }
}


export function exibirEstoqueID (req:Request, res:Response){
    try{
        const id = req.params.id
        const estoque = estoqueServico.listarID(id)
        res.status(200).json(
            {
                mensagem:"Estoque encontrado:",
                Estoque:estoque
            }
        )
    }catch(error:any){
        res.status(404).json({message: error.message})
    }
}

export function exibirEstoqueCarroID (req:Request, res:Response){
    try{
        const id_carro = req.params.id_carro
        const estoque = estoqueServico.listarEstoqueCarroID(id_carro)
        res.status(200).json(
            {
                mensagem:`Estoque carro ${id_carro} encontrado:`,
                Estoque:estoque
            }
        )
    }catch(error:any){
        res.status(404).json({message: error.message})
    }
}

export function atualizarEstoque(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const estoqueAtualizado = estoqueServico.atualizar(id, req.body);
        
        res.status(200).json({
            mensagem: "Estoque atualizado com sucesso!",
            Estoque: estoqueAtualizado
        });
    } catch (error: any) {
            res.status(404).json({ message: error.message })
    }
}

export function removerEstoque(req: Request, res: Response) {
    try {
        const id = req.params.id;
        estoqueServico.remover(id);
        
        res.status(200).json({ mensagem: "Estoque removido com sucesso!" });
    } catch (error: any) {
        if (error.message === "Estoque não encontrado") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

