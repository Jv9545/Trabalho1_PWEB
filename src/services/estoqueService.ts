import { Estoque } from "../models/Estoque";
import { EstoqueRepository } from "../repositories/estoqueRepository";
import { CarroRepository } from "../repositories/carroRepository";

export class EstoqueService {
    estoqueRepositorio: EstoqueRepository = EstoqueRepository.getInstance();
    carroRepositorio: CarroRepository = CarroRepository.getInstance();

    cadastrarEstoque(estoqueInfo: any): Estoque {
        const {id_carro, quantidade, localizacao_patio, data_entrada} = estoqueInfo

        const idToNumber: number = parseInt(id_carro, 10);

        const carroExiste = this.carroRepositorio.listarCarroID(idToNumber);
        if(carroExiste === undefined){
            throw new Error("Carro não existe")
        }
        if(this.estoqueRepositorio.verificaCarro(idToNumber) !== undefined){
            throw new Error("Carro já possui registro de estoque")
        }
        if(!id_carro || !localizacao_patio || !data_entrada){
            throw new Error("Preencha os todos os campos obrigatorios: id_carro, quantidade, localização e data entrada")
        }
        if(quantidade < 0 || quantidade === undefined || quantidade === null || quantidade == ""){
            throw new Error("Preencha  a quantidade com um valor maior ou igual a 0")
        }
        const dataEntradaObj = new Date(data_entrada);
        if(dataEntradaObj > new Date()){
            throw new Error("Data entrada nao pode ser posterior a hoje")
        }
        const novoEstoque = new Estoque(idToNumber, quantidade, localizacao_patio, data_entrada)
        this.estoqueRepositorio.insereEstoque(novoEstoque);
        return novoEstoque
    }

    listar(): Estoque[] {
        return this.estoqueRepositorio.listarTodosEstoques();
    }

    listarID(id:any): Estoque|undefined{
        const idToNumber: number = parseInt(id, 10)
        if(this.estoqueRepositorio.listarEstoqueID(idToNumber) == undefined){
            throw new Error("Estoque não encontrado")
        }
        return this.estoqueRepositorio.listarEstoqueID(idToNumber)
    }

    listarEstoqueCarroID(id_carro:any): Estoque|undefined{
        const id_carroToNumber: number = parseInt(id_carro, 10)

        const carroExiste = this.carroRepositorio.listarCarroID(id_carroToNumber);
        if(carroExiste === undefined){
            throw new Error("Carro não existe")
        }
        if(this.estoqueRepositorio.verificaCarro(id_carroToNumber) == undefined){
            throw new Error("Carro sem estoque registrado")
        }
        return this.estoqueRepositorio.verificaCarro(id_carroToNumber)
    }

    atualizar(id: any, dadosAtualizados: any): Estoque | undefined{
        const idToNumber: number = parseInt(id, 10);
        const estoqueExistente = this.estoqueRepositorio.listarEstoqueID(idToNumber);

        if (!estoqueExistente) {
            throw new Error("ID não encontrado");
        }
        if(dadosAtualizados.quantidade < 0 || dadosAtualizados.quantidade === undefined || dadosAtualizados.quantidade === null || dadosAtualizados.quantidade == ""){
            throw new Error("Preencha  a quantidade com um valor maior ou igual a 0")
        }
        if(!dadosAtualizados.localizacao_patio){
            throw new Error("Preencha todos os campos obrigatorios: localização")
        }
        return this.estoqueRepositorio.atualizarEstoque(idToNumber, dadosAtualizados);
    }

    remover(id: any): boolean {
        const idToNumber: number = parseInt(id, 10);
        const removido = this.estoqueRepositorio.removerEstoqueId(idToNumber);
        
        if (!removido) {
            throw new Error("Estoque não encontrado");
        }
        
        return removido;
    }
}