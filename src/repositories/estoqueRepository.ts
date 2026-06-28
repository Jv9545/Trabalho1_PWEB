import { executarComandoSQL } from "../database/mysql";
import { Estoque } from "../models/Estoque";

export class EstoqueRepository {
    private static instance: EstoqueRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS Estoque (
            id_estoque INT AUTO_INCREMENT PRIMARY KEY, 
            id_carro INT NOT NULL UNIQUE, 
            quantidade INT NOT NULL,
            localizacao_patio VARCHAR(255) NOT NULL,
            data_entrada DATETIME NOT NULL
        );
        `;
    }

    private constructor() {}

    public static getInstance(): EstoqueRepository {
        if (!this.instance) {
            this.instance = new EstoqueRepository();
        }
        return this.instance;
    }

    async insereEstoque(estoque: Estoque): Promise<Estoque> {
        const resultado = await executarComandoSQL(
            "INSERT INTO Estoque (id_carro, quantidade, localizacao_patio, data_entrada) VALUES (?, ?, ?, ?)",
            [estoque.id_carro, estoque.quantidade, estoque.localizacao_patio, estoque.data_entrada]
        );

        const idGerado = resultado.insertId;

        const novoEstoque = new Estoque(
            idGerado, 
            estoque.id_carro, 
            estoque.quantidade, 
            estoque.localizacao_patio, 
            estoque.data_entrada
        );

        console.log('Estoque inserido com sucesso:', novoEstoque);
        return novoEstoque;
    }

    async listarTodosEstoques(): Promise<Estoque[]> {
        const linhas = await executarComandoSQL("SELECT * FROM Estoque", []);

        const estoques: Estoque[] = linhas.map((linha: any) => {
            return new Estoque(
                linha.id_estoque, 
                Number(linha.id_carro), 
                Number(linha.quantidade), 
                linha.localizacao_patio, 
                new Date(linha.data_entrada)
            );
        });

        return estoques;
    }

    async listarEstoqueID(id: number): Promise<Estoque | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Estoque WHERE id_estoque = ?",
            [id]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Estoque(
            linha.id_estoque, 
            Number(linha.id_carro), 
            Number(linha.quantidade), 
            linha.localizacao_patio, 
            new Date(linha.data_entrada)
        );
    }

    async verificaCarro(idCarro: number): Promise<Estoque | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Estoque WHERE id_carro = ?",
            [idCarro]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Estoque(
            linha.id_estoque, 
            Number(linha.id_carro), 
            Number(linha.quantidade), 
            linha.localizacao_patio, 
            new Date(linha.data_entrada)
        );
    }

    async atualizarEstoque(id: number, dadosAtualizados: any): Promise<Estoque> {
        // Baseado no seu repositório em memória, apenas quantidade e localizacao_patio são atualizados
        const query = "UPDATE Estoque SET quantidade = ?, localizacao_patio = ? WHERE id_estoque = ?";

        try {
            await executarComandoSQL(query, [
                dadosAtualizados.quantidade, 
                dadosAtualizados.localizacao_patio, 
                id
            ]);
            
            // Busca o registro atualizado para retornar a data e o id_carro originais corretamente
            const linhas = await executarComandoSQL("SELECT * FROM Estoque WHERE id_estoque = ?", [id]);
            const linha = linhas[0];
            
            const estoqueAtualizado = new Estoque(
                linha.id_estoque, 
                Number(linha.id_carro), 
                Number(linha.quantidade), 
                linha.localizacao_patio, 
                new Date(linha.data_entrada)
            );
            
            console.log('Estoque atualizado com sucesso:', estoqueAtualizado);
            return estoqueAtualizado;
            
        } catch (err: any) {
            console.error(`Erro ao atualizar o estoque de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }

    async removerEstoqueId(id: number): Promise<boolean> {
        const query = "DELETE FROM Estoque WHERE id_estoque = ?";

        try {
            const resultado = await executarComandoSQL(query, [id]);
            console.log(`Estoque de ID ${id} deletado com sucesso.`);
            return resultado.affectedRows > 0;
        } catch (err: any) {
            console.error(`Falha ao deletar o estoque de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }
}