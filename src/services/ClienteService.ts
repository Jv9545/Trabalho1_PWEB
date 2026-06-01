import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/clienteRepository"
import { NotaFiscalRepository } from "../repositories/notaFiscalRepository"

export class ClienteService {
    clienteRepositorio: ClienteRepository = ClienteRepository.getInstance()
    notaFiscalRepositorio: NotaFiscalRepository = NotaFiscalRepository.getInstance()

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

        // Verifica os campos obrigatorios e verifica se o novo CPF é diferente do atual, se true, ele verifica se nao conflica com algum outro cliente   
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

    remover(id: any): boolean {
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        // Regra de negócio: não remover se possuir notas fiscais vinculadas
        const todasNotas = this.notaFiscalRepositorio.listarTodasNotas();
        const temNotaVinculada = todasNotas.some(nota => nota.id_cliente === idToNumber);
        
        if (temNotaVinculada) {
            throw new Error("Não é possível remover: cliente possui nota fiscal vinculada.");
        }

        return this.clienteRepositorio.removerClienteId(idToNumber);
    }

    listarNotas(id: any) {
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        const todasNotas = this.notaFiscalRepositorio.listarTodasNotas();
        
        // Filtra e retorna apenas as notas vinculadas ao ID deste cliente
        return todasNotas.filter(nota => nota.id_cliente === idToNumber);
    }

}