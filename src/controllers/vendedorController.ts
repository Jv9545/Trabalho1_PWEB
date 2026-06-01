import {Request, Response } from "express"
import { VendedorService } from "../services/vendedorService"
const vendedorServico = new VendedorService();

export function cadastrarVendedores (req:Request, res:Response){
    try{
        const novoVendedor = vendedorServico.cadastrarVendedor(req.body)
        res.status(201).json(
            {
            mensagem:"Vendedor cadastrado com sucesso!",
            NovoVendedor:novoVendedor
            }
        )
    } catch(error:any){
        res.status(409).json({message: error.message})
    }
}

export function exibirVendedores (req:Request, res:Response){
    try{
        res.status(200).json(vendedorServico.listar())
    }catch(error:any){
        res.status(400).json({message: error.message})
    }
}

export function exibirVendedorID (req:Request, res:Response){
    try{
        const id = req.params.id
        const vendedor = vendedorServico.listarID(id)
        res.status(200).json(
            {
                mensagem:"Vendedor encontrado:",
                Vendedor:vendedor
            }
        )
    }catch(error:any){
        res.status(404).json({message: error.message})
    }
}

export function atualizarVendedor(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const vendedorAtualizado = vendedorServico.atualizar(id, req.body);
        
        res.status(200).json({
            mensagem: "Vendedor atualizado com sucesso!",
            Vendedor: vendedorAtualizado
        });
    } catch (error: any) {
        if (error.message === "ID não encontrado") {
            res.status(404).json({ message: error.message })
        } else if (error.message === "Esta matricula já está registado outro vendedor"){
            res.status(409).json({ message: error.message })
        }else{
            res.status(400).json({ message: error.message })
        }
    }
}

export function removerVendedor(req: Request, res: Response) {
    try {
        const id = req.params.id;
        vendedorServico.remover(id);
        
        res.status(200).json({ mensagem: "Vendedor removido com sucesso!" });
    } catch (error: any) {
        if (error.message === "Vendedor não encontrado") {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Não é possível remover")) {
            res.status(422).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

export function exibirNotasVendedor(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const notas = vendedorServico.listarNotas(id);
        
        res.status(200).json(notas);
    } catch (error: any) {
        if (error.message === "Vendedor não encontrado") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
}

