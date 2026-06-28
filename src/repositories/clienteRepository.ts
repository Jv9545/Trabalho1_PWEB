import { executarComandoSQL } from "../database/mysql";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
    private static instance: ClienteRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS Cliente (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY, 
            nome VARCHAR(255) NOT NULL, 
            cpf VARCHAR(20) NOT NULL UNIQUE,
            telefone VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            cidade VARCHAR(255) NOT NULL
        );
        `;
    }

    private constructor() {}

    public static getInstance(): ClienteRepository {
        if (!this.instance) {
            this.instance = new ClienteRepository();
        }
        return this.instance;
    }

    async insereCliente(cliente: Cliente): Promise<Cliente> {
        const resultado = await executarComandoSQL(
            "INSERT INTO Cliente (nome, cpf, telefone, email, cidade) VALUES (?, ?, ?, ?, ?)",
            [cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.cidade]
        );

        const idGerado = resultado.insertId;

        const novoCliente = new Cliente(idGerado, cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.cidade);

        console.log('Cliente inserido com sucesso:', novoCliente);
        return novoCliente;
    }

    async listarTodosClientes(): Promise<Cliente[]> {
        const linhas = await executarComandoSQL("SELECT * FROM Cliente", []);

        const clientes: Cliente[] = linhas.map((linha: any) => {
            return new Cliente(
                linha.id_cliente, 
                linha.nome, 
                linha.cpf, 
                linha.telefone, 
                linha.email, 
                linha.cidade
            );
        });

        return clientes;
    }

    async listarClienteID(id: number): Promise<Cliente | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Cliente WHERE id_cliente = ?",
            [id]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Cliente(
            linha.id_cliente, 
            linha.nome, 
            linha.cpf, 
            linha.telefone, 
            linha.email, 
            linha.cidade
        );
    }

    async verificaCpf(cpf: string): Promise<Cliente | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Cliente WHERE cpf = ?",
            [cpf]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Cliente(
            linha.id_cliente, 
            linha.nome, 
            linha.cpf, 
            linha.telefone, 
            linha.email, 
            linha.cidade
        );
    }

    async atualizarCliente(id: number, dadosAtualizados: any): Promise<Cliente> {
        const query = "UPDATE Cliente SET nome = ?, cpf = ?, telefone = ?, email = ?, cidade = ? WHERE id_cliente = ?";

        try {
            await executarComandoSQL(query, [
                dadosAtualizados.nome, 
                dadosAtualizados.cpf, 
                dadosAtualizados.telefone, 
                dadosAtualizados.email, 
                dadosAtualizados.cidade, 
                id
            ]);
            
            const clienteAtualizado = new Cliente(
                id, 
                dadosAtualizados.nome, 
                dadosAtualizados.cpf, 
                dadosAtualizados.telefone, 
                dadosAtualizados.email, 
                dadosAtualizados.cidade
            );
            
            console.log('Cliente atualizado com sucesso:', clienteAtualizado);
            return clienteAtualizado;
            
        } catch (err: any) {
            console.error(`Erro ao atualizar o cliente de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }

    async removerClienteId(id: number): Promise<boolean> {
        const query = "DELETE FROM Cliente WHERE id_cliente = ?";

        try {
            const resultado = await executarComandoSQL(query, [id]);
            console.log(`Cliente de ID ${id} deletado com sucesso.`);
            return resultado.affectedRows > 0;
        } catch (err: any) {
            console.error(`Falha ao deletar o cliente de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }
}