import { Carro } from "../models/Carro";
import { CarroRepository } from "../repositories/carroRepository"
import { EstoqueRepository } from "../repositories/estoqueRepository"
import { NotaFiscalRepository } from "../repositories/notaFiscalRepository"

export class CarroService {
    carroRepositorio: CarroRepository = CarroRepository.getInstance()
    estoqueRepositorio: EstoqueRepository = EstoqueRepository.getInstance()
    notaFiscalRepositorio: NotaFiscalRepository = NotaFiscalRepository.getInstance()

    cadastrarCarro(CarroInfo: any): Carro {
        const {marca, modelo, ano, placa, preco, cor} = CarroInfo
        if(this.carroRepositorio.verificaPlaca(placa) != undefined){
            throw new Error("Placa já cadastrada")
        }
        const proximoAno = new Date().getFullYear() + 1
        if(ano < 1950 || ano > proximoAno){
            throw new Error(`Ano deve ser entre 1950 e ${proximoAno}`)
        }
        if(preco <= 0 ){
            throw new Error(`Preço deve ser maior que 0`)
        }
        if(!marca || !modelo || !ano || !placa || !preco || !cor){
            throw new Error("Preencha os todos os campos obrigatorios: marca, modelo, ano, placa, preco e cor")
        }   
        
        const novoCarro = new Carro(marca, modelo, ano, placa, preco, cor)
        this.carroRepositorio.insereCarro(novoCarro);
        return novoCarro
    }

    listar(): Carro[] {
        return this.carroRepositorio.listarTodosCarros();
    }

    listarID(id:any): Carro|undefined{
        const idToNumber: number = parseInt(id, 10)
        if(this.carroRepositorio.listarCarroID(idToNumber) == undefined){
            throw new Error("ID não encontrado")
        }
        return this.carroRepositorio.listarCarroID(idToNumber)
    }

    atualizar(id: any, dadosAtualizados: any): Carro | undefined{
        const idToNumber: number = parseInt(id, 10);
        const carroExistente = this.carroRepositorio.listarCarroID(idToNumber);

        if (!carroExistente) {
            throw new Error("ID não encontrado");
        }

        // Verifica as regras de negocio
        if(dadosAtualizados.placa !== carroExistente.placa){
            if(this.carroRepositorio.verificaPlaca(dadosAtualizados.placa) != undefined){
            throw new Error("Placa já cadastrada")
            }
        }
        const proximoAno = new Date().getFullYear() + 1
        if(dadosAtualizados.ano < 1950 || dadosAtualizados.ano > proximoAno){
            throw new Error(`Ano deve ser entre 1950 e ${proximoAno}`)
        }
                
        if(dadosAtualizados.preco <= 0 ){
            throw new Error(`Preço deve ser maior que 0`)
        }
        if( !dadosAtualizados.marca || !dadosAtualizados.modelo || !dadosAtualizados.ano || !dadosAtualizados.placa || !dadosAtualizados.preco || !dadosAtualizados.cor){
            throw new Error("Preencha os todos os campos obrigatorios: marca, modelo, ano, placa, preco e cor")
        }

        return this.carroRepositorio.atualizarCarro(idToNumber, dadosAtualizados);
    }

    listarDisponiveis(): Carro[] {
        const todosCarros = this.carroRepositorio.listarTodosCarros();
        
        // Filtra os carros verificando no Estoque se existem e se a quantidade é maior que 0
        const carrosDisponiveis = todosCarros.filter(carro => {
            const estoque = this.estoqueRepositorio.verificaCarro(carro.id_carro);
            return estoque !== undefined && estoque.quantidade > 0;
        });

        return carrosDisponiveis;
    }

    remover(id: any): boolean {
        const idToNumber: number = parseInt(id, 10);
        const carroExistente = this.carroRepositorio.listarCarroID(idToNumber);

        if (!carroExistente) {
            throw new Error("Carro não encontrado");
        }

        if (this.estoqueRepositorio.verificaCarro(idToNumber) !== undefined) {
            throw new Error("Não é possível remover: carro possui registro em estoque.");
        }

        const todasNotas = this.notaFiscalRepositorio.listarTodasNotas();
        const temNotaVinculada = todasNotas.some(nota => nota.id_carro === idToNumber);
        if (temNotaVinculada) {
            throw new Error("Não é possível remover: carro possui nota fiscal vinculada.");
        }

        return this.carroRepositorio.removerCarroId(idToNumber);
    }

}