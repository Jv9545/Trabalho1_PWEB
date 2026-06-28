import { Estoque } from "../models/Estoque";
import { EstoqueRepository } from "../repositories/estoqueRepository";
import { CarroRepository } from "../repositories/carroRepository";

export class EstoqueService {
    estoqueRepositorio: EstoqueRepository = EstoqueRepository.getInstance();
    carroRepositorio: CarroRepository = CarroRepository.getInstance();

    async cadastrarEstoque(estoqueInfo: any): Promise<Estoque> {
        const { id_carro, quantidade, localizacao_patio, data_entrada } = estoqueInfo;

        const idToNumber: number = parseInt(id_carro, 10);

        const carroExiste = await this.carroRepositorio.listarCarroID(idToNumber);
        if (carroExiste === undefined) {
            throw new Error("Carro não existe");
        }
        
        const estoqueExiste = await this.estoqueRepositorio.verificaCarro(idToNumber);
        if (estoqueExiste !== undefined) {
            throw new Error("Carro já possui registro de estoque");
        }
        
        if (!id_carro || !localizacao_patio || !data_entrada) {
            throw new Error("Preencha os todos os campos obrigatorios: id_carro, quantidade, localização e data entrada");
        }
        
        if (quantidade < 0 || quantidade === undefined || quantidade === null || quantidade == "") {
            throw new Error("Preencha  a quantidade com um valor maior ou igual a 0");
        }
        
        const dataEntradaObj = new Date(data_entrada);
        if (dataEntradaObj > new Date()) {
            throw new Error("Data entrada nao pode ser posterior a hoje");
        }
        
        // Passa null como primeiro parâmetro, pois o ID será gerado pela base de dados
        const novoEstoque = new Estoque(null, idToNumber, quantidade, localizacao_patio, dataEntradaObj);
        return await this.estoqueRepositorio.insereEstoque(novoEstoque);
    }

    async listar(): Promise<Estoque[]> {
        return await this.estoqueRepositorio.listarTodosEstoques();
    }

    async listarID(id: any): Promise<Estoque> {
        const idToNumber: number = parseInt(id, 10);
        const estoque = await this.estoqueRepositorio.listarEstoqueID(idToNumber);
        
        if (estoque === undefined) {
            throw new Error("Estoque não encontrado");
        }
        
        return estoque;
    }

    async listarEstoqueCarroID(id_carro: any): Promise<Estoque> {
        const id_carroToNumber: number = parseInt(id_carro, 10);

        const carroExiste = await this.carroRepositorio.listarCarroID(id_carroToNumber);
        if (carroExiste === undefined) {
            throw new Error("Carro não existe");
        }
        
        const estoque = await this.estoqueRepositorio.verificaCarro(id_carroToNumber);
        if (estoque === undefined) {
            throw new Error("Carro sem estoque registrado");
        }
        
        return estoque;
    }

    async atualizar(id: any, dadosAtualizados: any): Promise<Estoque> {
        const idToNumber: number = parseInt(id, 10);
        const estoqueExistente = await this.estoqueRepositorio.listarEstoqueID(idToNumber);

        if (!estoqueExistente) {
            throw new Error("ID não encontrado");
        }
        
        if (dadosAtualizados.quantidade < 0 || dadosAtualizados.quantidade === undefined || dadosAtualizados.quantidade === null || dadosAtualizados.quantidade == "") {
            throw new Error("Preencha  a quantidade com um valor maior ou igual a 0");
        }
        
        if (!dadosAtualizados.localizacao_patio) {
            throw new Error("Preencha todos os campos obrigatorios: localização");
        }
        
        return await this.estoqueRepositorio.atualizarEstoque(idToNumber, dadosAtualizados);
    }

    async remover(id: any): Promise<boolean> {
        const idToNumber: number = parseInt(id, 10);
        const removido = await this.estoqueRepositorio.removerEstoqueId(idToNumber);
        
        if (!removido) {
            throw new Error("Estoque não encontrado");
        }
        
        return removido;
    }
}