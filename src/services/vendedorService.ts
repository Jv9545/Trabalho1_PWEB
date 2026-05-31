import { Vendedor } from "../models/Vendedor";
import { VendedorRepository } from "../repositories/vendedorRepository";

export class VendedorService {
    vendedorRepositorio: VendedorRepository = VendedorRepository.getInstance();

    cadastrarVendedor(VendedorInfo: any): Vendedor {
        const {nome, matricula, comissao_percentual} = VendedorInfo
        if(this.vendedorRepositorio.verificaMatricula(matricula) != undefined){
            throw new Error("Matricula já cadastrado")
        }
        if(!nome || !matricula || !comissao_percentual){
            throw new Error("Preencha os todos os campos obrigatorios: nome, matricula e comissão")
        }
        if(comissao_percentual < 0 || comissao_percentual > 30){
            throw new Error("Comissão deve ser entre 0 e 30")
        }
        const novoVendedor = new Vendedor(nome, matricula,comissao_percentual)
        this.vendedorRepositorio.insereVendedor(novoVendedor);
        return novoVendedor
    }

    listar(): Vendedor[] {
        return this.vendedorRepositorio.listarTodosVendedores();
    }

    listarID(id:any): Vendedor | undefined{
        const idToNumber: number = parseInt(id, 10)
        if(this.vendedorRepositorio.listarVendedorID(idToNumber) == undefined){
            throw new Error("ID não encontrado")
        }
        return this.vendedorRepositorio.listarVendedorID(idToNumber)
    }

    atualizar(id: any, dadosAtualizados: any): Vendedor | undefined{
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = this.vendedorRepositorio.listarVendedorID(idToNumber);

        if (!clienteExistente) {
            throw new Error("ID não encontrado");
        }

        // Verifica os campos obrigatorios e verifica se a nova matricula é diferente da atual, se true, ele verifica se nao conflica com algum outro vendedor   
        if ( dadosAtualizados.nome && dadosAtualizados.matricula && dadosAtualizados.comissao_percentual) {
            if(dadosAtualizados.matricula !== clienteExistente.matricula){
                if (this.vendedorRepositorio.verificaMatricula(dadosAtualizados.matricula) != undefined) {
                    throw new Error("Esta matricula já está registado outro vendedor");
                }
            }
            
        }else{
            throw new Error("Preencha os todos os campos obrigatorios: nome, matricula e comissão")
        }

        return this.vendedorRepositorio.atualizarVendedor(idToNumber, dadosAtualizados);
    }

}