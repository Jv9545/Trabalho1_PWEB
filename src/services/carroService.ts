import { Carro } from "../models/Carro";
import { CarroRepository } from "../repositories/carroRepository";
import { EstoqueRepository } from "../repositories/estoqueRepository";
import { NotaFiscalRepository } from "../repositories/notaFiscalRepository";

export class CarroService {
    carroRepositorio: CarroRepository = CarroRepository.getInstance();
    estoqueRepositorio: EstoqueRepository = EstoqueRepository.getInstance();
    notaFiscalRepositorio: NotaFiscalRepository = NotaFiscalRepository.getInstance();

    async cadastrarCarro(CarroInfo: any): Promise<Carro> {
        const { marca, modelo, ano, placa, preco, cor } = CarroInfo;
        
        const placaExiste = await this.carroRepositorio.verificaPlaca(placa);
        if (placaExiste !== undefined) {
            throw new Error("Placa já cadastrada");
        }
        
        const proximoAno = new Date().getFullYear() + 1;
        if (ano < 1950 || ano > proximoAno) {
            throw new Error(`Ano deve ser entre 1950 e ${proximoAno}`);
        }
        
        if (preco <= 0) {
            throw new Error(`Preço deve ser maior que 0`);
        }
        
        if (!marca || !modelo || !ano || !placa || !preco || !cor) {
            throw new Error("Preencha os todos os campos obrigatorios: marca, modelo, ano, placa, preco e cor");
        }   
        
        // Passamos null no primeiro parâmetro porque o banco de dados irá gerar o ID (AUTO_INCREMENT)
        const novoCarro = new Carro(null, marca, modelo, ano, placa, preco, cor);
        return await this.carroRepositorio.insereCarro(novoCarro);
    }

    async listar(): Promise<Carro[]> {
        return await this.carroRepositorio.listarTodosCarros();
    }

    async listarID(id: any): Promise<Carro> {
        const idToNumber: number = parseInt(id, 10);
        const carro = await this.carroRepositorio.listarCarroID(idToNumber);
        
        if (carro === undefined) {
            throw new Error("ID não encontrado");
        }
        
        return carro;
    }

    async atualizar(id: any, dadosAtualizados: any): Promise<Carro> {
        const idToNumber: number = parseInt(id, 10);
        const carroExistente = await this.carroRepositorio.listarCarroID(idToNumber);

        if (!carroExistente) {
            throw new Error("ID não encontrado");
        }

        // Verifica as regras de negocio
        if (dadosAtualizados.placa !== carroExistente.placa) {
            const placaExiste = await this.carroRepositorio.verificaPlaca(dadosAtualizados.placa);
            if (placaExiste !== undefined) {
                throw new Error("Placa já cadastrada");
            }
        }
        
        const proximoAno = new Date().getFullYear() + 1;
        if (dadosAtualizados.ano < 1950 || dadosAtualizados.ano > proximoAno) {
            throw new Error(`Ano deve ser entre 1950 e ${proximoAno}`);
        }
                
        if (dadosAtualizados.preco <= 0) {
            throw new Error(`Preço deve ser maior que 0`);
        }
        
        if (!dadosAtualizados.marca || !dadosAtualizados.modelo || !dadosAtualizados.ano || !dadosAtualizados.placa || !dadosAtualizados.preco || !dadosAtualizados.cor) {
            throw new Error("Preencha os todos os campos obrigatorios: marca, modelo, ano, placa, preco e cor");
        }

        return await this.carroRepositorio.atualizarCarro(idToNumber, dadosAtualizados);
    }

    async listarDisponiveis(): Promise<Carro[]> {
        const todosCarros = await this.carroRepositorio.listarTodosCarros();
        const carrosDisponiveis: Carro[] = [];
        
        // Loop para lidar com requisições assíncronas ao banco no repositório de estoque
        for (const carro of todosCarros) {
            if (carro.id_carro !== null) {
                const estoque = await this.estoqueRepositorio.verificaCarro(carro.id_carro);
                if (estoque !== undefined && estoque.quantidade > 0) {
                    carrosDisponiveis.push(carro);
                }
            }
        }

        return carrosDisponiveis;
    }

    async remover(id: any): Promise<boolean> {
        const idToNumber: number = parseInt(id, 10);
        const carroExistente = await this.carroRepositorio.listarCarroID(idToNumber);

        if (!carroExistente) {
            throw new Error("Carro não encontrado");
        }

        const estoqueExistente = await this.estoqueRepositorio.verificaCarro(idToNumber);
        if (estoqueExistente !== undefined) {
            throw new Error("Não é possível remover: carro possui registro em estoque.");
        }

        const todasNotas = await this.notaFiscalRepositorio.listarTodasNotas();
        const temNotaVinculada = todasNotas.some(nota => nota.id_carro === idToNumber);
        if (temNotaVinculada) {
            throw new Error("Não é possível remover: carro possui nota fiscal vinculada.");
        }

        return await this.carroRepositorio.removerCarroId(idToNumber);
    }
}