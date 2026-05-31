import {Estoque} from "../models/Estoque"

export class EstoqueRepository{
    private static instance: EstoqueRepository;
    private listaEstoques: Estoque[] = [];


    private constructor(){}

    public static getInstance(): EstoqueRepository{
        if(!this.instance){
            this.instance = new EstoqueRepository();
        }
        return this.instance;
    }

    public insereEstoque(estoque: Estoque){
        this.listaEstoques.push(estoque)
    }

    public listarTodosEstoques(): Estoque[] {
        return this.listaEstoques;
    }

    public listarEstoqueID(id:number):Estoque|undefined{
        return this.listaEstoques.find(estoque => estoque.id_estoque === id)
    }

    public verificaCarro(idCarro:number):Estoque|undefined{
        return this.listaEstoques.find(estoque => estoque.id_carro === idCarro)
    }

    public atualizarEstoque(id: number, dadosAtualizados: any): Estoque | undefined {
        const estoque = this.listarEstoqueID(id);
        
        if (estoque) {
            estoque.quantidade = dadosAtualizados.quantidade;
            estoque.localizacao_patio = dadosAtualizados.localizacao_patio;
        }
        
        return estoque;
    }

    public removerEstoqueId(id: number): boolean {
        const index = this.listaEstoques.findIndex(estoque => estoque.id_estoque === id);
        
        if (index !== -1) {
            this.listaEstoques.splice(index, 1);
            return true;
        }
        
        return false;
    }
}