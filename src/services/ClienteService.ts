import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/clienteRepository";

export class ClienteService {
    clienteRepositorio: ClienteRepository = ClienteRepository.getInstance();

    cadastrarCliente(ClienteInfo: any): Cliente {
        const {nome, cpf, telefone, email, cidade} = ClienteInfo
        if(this.clienteRepositorio.verificaCpf(cpf) != undefined){
            throw new Error("CPF já cadastrado")
        }
        if(!nome || !cpf || !telefone){
            throw new Error("Preencha os todos os campos obrigatorios: nome, CPF e telefone")
        }
        const novoCliente = new Cliente(nome, cpf,telefone,email,cidade)
        this.clienteRepositorio.insereCliente(novoCliente);
        return novoCliente
    }

    listar(): Cliente[] {
        return this.clienteRepositorio.listarTodosClientes();
    }

    listarID(id:any): Cliente|undefined{
        const idToNumber: number = parseInt(id, 10)
        if(this.clienteRepositorio.listarClienteID(idToNumber) == undefined){
            throw new Error("ID não encontrado")
        }
        return this.clienteRepositorio.listarClienteID(idToNumber)
    }

    atualizar(id: any, dadosAtualizados: any): Cliente | undefined{
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("ID não encontrado");
        }

        // Se o CPF for enviado na atualização e for diferente do atual, verifica se já existe
        if ( dadosAtualizados.nome && dadosAtualizados.cpf && dadosAtualizados.telefone) {
            if(dadosAtualizados.cpf !== clienteExistente.cpf){
                if (this.clienteRepositorio.verificaCpf(dadosAtualizados.cpf) != undefined) {
                    throw new Error("Este CPF já está registado outro cliente");
                }
            }
            
        }else{
            throw new Error("Preencha todos os campos obrigatorios: nome, CPF e telefone")
        }

        return this.clienteRepositorio.atualizarCliente(idToNumber, dadosAtualizados);
    }

}