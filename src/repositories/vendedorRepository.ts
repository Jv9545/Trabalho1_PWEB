import { executarComandoSQL } from "../database/mysql";
import { Vendedor } from "../models/Vendedor";

export class VendedorRepository {
    private static instance: VendedorRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS Vendedor (
            id_vendedor INT AUTO_INCREMENT PRIMARY KEY, 
            nome VARCHAR(255) NOT NULL, 
            matricula VARCHAR(50) NOT NULL UNIQUE,
            comissao_percentual DECIMAL(5,2) NOT NULL
        );
        `;
    }

    private constructor() {}

    public static getInstance(): VendedorRepository {
        if (!this.instance) {
            this.instance = new VendedorRepository();
        }
        return this.instance;
    }

    async insereVendedor(vendedor: Vendedor): Promise<Vendedor> {
        const resultado = await executarComandoSQL(
            "INSERT INTO Vendedor (nome, matricula, comissao_percentual) VALUES (?, ?, ?)",
            [vendedor.nome, vendedor.matricula, vendedor.comissao_percentual]
        );

        const idGerado = resultado.insertId;

        const novoVendedor = new Vendedor(
            idGerado, 
            vendedor.nome, 
            vendedor.matricula, 
            vendedor.comissao_percentual
        );

        console.log('Vendedor inserido com sucesso:', novoVendedor);
        return novoVendedor;
    }

    async listarTodosVendedores(): Promise<Vendedor[]> {
        const linhas = await executarComandoSQL("SELECT * FROM Vendedor", []);

        const vendedores: Vendedor[] = linhas.map((linha: any) => {
            return new Vendedor(
                linha.id_vendedor, 
                linha.nome, 
                linha.matricula, 
                Number(linha.comissao_percentual)
            );
        });

        return vendedores;
    }

    async listarVendedorID(id: number): Promise<Vendedor | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Vendedor WHERE id_vendedor = ?",
            [id]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Vendedor(
            linha.id_vendedor, 
            linha.nome, 
            linha.matricula, 
            Number(linha.comissao_percentual)
        );
    }

    async verificaMatricula(matricula: string): Promise<Vendedor | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Vendedor WHERE matricula = ?",
            [matricula]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Vendedor(
            linha.id_vendedor, 
            linha.nome, 
            linha.matricula, 
            Number(linha.comissao_percentual)
        );
    }

    async atualizarVendedor(id: number, dadosAtualizados: any): Promise<Vendedor> {
        const query = "UPDATE Vendedor SET nome = ?, matricula = ?, comissao_percentual = ? WHERE id_vendedor = ?";

        try {
            await executarComandoSQL(query, [
                dadosAtualizados.nome, 
                dadosAtualizados.matricula, 
                dadosAtualizados.comissao_percentual, 
                id
            ]);
            
            const vendedorAtualizado = new Vendedor(
                id, 
                dadosAtualizados.nome, 
                dadosAtualizados.matricula, 
                dadosAtualizados.comissao_percentual
            );
            
            console.log('Vendedor atualizado com sucesso:', vendedorAtualizado);
            return vendedorAtualizado;
            
        } catch (err: any) {
            console.error(`Erro ao atualizar o vendedor de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }

    async removerVendedorId(id: number): Promise<boolean> {
        const query = "DELETE FROM Vendedor WHERE id_vendedor = ?";

        try {
            const resultado = await executarComandoSQL(query, [id]);
            console.log(`Vendedor de ID ${id} deletado com sucesso.`);
            return resultado.affectedRows > 0;
        } catch (err: any) {
            console.error(`Falha ao deletar o vendedor de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }
}