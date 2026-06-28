import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/clienteRepository";
import { NotaFiscalRepository } from "../repositories/notaFiscalRepository";

export class ClienteService {
    clienteRepositorio: ClienteRepository = ClienteRepository.getInstance();
    notaFiscalRepositorio: NotaFiscalRepository = NotaFiscalRepository.getInstance();

    async cadastrarCliente(ClienteInfo: any): Promise<Cliente> {
        const { nome, cpf, telefone, email, cidade } = ClienteInfo;
        
        const cpfExiste = await this.clienteRepositorio.verificaCpf(cpf);
        if (cpfExiste !== undefined) {
            throw new Error("CPF já cadastrado");
        }
        
        if (!nome || !cpf || !telefone) {
            throw new Error("Preencha todos os campos obrigatorios: nome, CPF e telefone");
        }
        
        // Passa null como primeiro parâmetro, pois o ID será gerado pelo banco de dados
        const novoCliente = new Cliente(null, nome, cpf, telefone, email, cidade);
        return await this.clienteRepositorio.insereCliente(novoCliente);
    }

    async listar(): Promise<Cliente[]> {
        return await this.clienteRepositorio.listarTodosClientes();
    }

    async listarID(id: any): Promise<Cliente> {
        const idToNumber: number = parseInt(id, 10);
        const cliente = await this.clienteRepositorio.listarClienteID(idToNumber);
        
        if (cliente === undefined) {
            throw new Error("ID não encontrado");
        }
        
        return cliente;
    }

    async atualizar(id: any, dadosAtualizados: any): Promise<Cliente> {
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = await this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("ID não encontrado");
        }

        // Verifica os campos obrigatorios e verifica se o novo CPF é diferente do atual
        if (dadosAtualizados.nome && dadosAtualizados.cpf && dadosAtualizados.telefone) {
            if (dadosAtualizados.cpf !== clienteExistente.cpf) {
                const cpfExiste = await this.clienteRepositorio.verificaCpf(dadosAtualizados.cpf);
                if (cpfExiste !== undefined) {
                    throw new Error("Este CPF já está registado para outro cliente");
                }
            }
        } else {
            throw new Error("Preencha todos os campos obrigatorios: nome, CPF e telefone");
        }

        return await this.clienteRepositorio.atualizarCliente(idToNumber, dadosAtualizados);
    }

    async remover(id: any): Promise<boolean> {
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = await this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        // Regra de negócio: não remover se possuir notas fiscais vinculadas
        const todasNotas = await this.notaFiscalRepositorio.listarTodasNotas();
        const temNotaVinculada = todasNotas.some(nota => nota.id_cliente === idToNumber);
        
        if (temNotaVinculada) {
            throw new Error("Não é possível remover: cliente possui nota fiscal vinculada.");
        }

        return await this.clienteRepositorio.removerClienteId(idToNumber);
    }

    async listarNotas(id: any) {
        const idToNumber: number = parseInt(id, 10);
        const clienteExistente = await this.clienteRepositorio.listarClienteID(idToNumber);

        if (!clienteExistente) {
            throw new Error("Cliente não encontrado");
        }

        const todasNotas = await this.notaFiscalRepositorio.listarTodasNotas();
        
        // Filtra e retorna apenas as notas vinculadas ao ID deste cliente
        return todasNotas.filter(nota => nota.id_cliente === idToNumber);
    }
}