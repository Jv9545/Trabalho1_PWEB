import { executarComandoSQL } from "../database/mysql";
import { Carro } from "../models/Carro";

export class CarroRepository {
    private static instance: CarroRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS Carro (
            id_carro INT AUTO_INCREMENT PRIMARY KEY, 
            marca VARCHAR(255) NOT NULL, 
            modelo VARCHAR(255) NOT NULL,
            ano INT NOT NULL,
            placa VARCHAR(20) NOT NULL UNIQUE,
            preco DECIMAL(10,2) NOT NULL,
            cor VARCHAR(50) NOT NULL
        );
        `;
    }

    private constructor() {}

    public static getInstance(): CarroRepository {
        if (!this.instance) {
            this.instance = new CarroRepository();
        }
        return this.instance;
    }

    async insereCarro(carro: Carro): Promise<Carro> {
        const resultado = await executarComandoSQL(
            "INSERT INTO Carro (marca, modelo, ano, placa, preco, cor) VALUES (?, ?, ?, ?, ?, ?)",
            [carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor]
        );

        const idGerado = resultado.insertId;

        const novoCarro = new Carro(idGerado, carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor);

        console.log('Carro inserido com sucesso:', novoCarro);
        return novoCarro;
    }

    async listarTodosCarros(): Promise<Carro[]> {
        const linhas = await executarComandoSQL("SELECT * FROM Carro", []);

        const carros: Carro[] = linhas.map((linha: any) => {
            return new Carro(
                linha.id_carro, 
                linha.marca, 
                linha.modelo, 
                Number(linha.ano), 
                linha.placa, 
                Number(linha.preco), 
                linha.cor
            );
        });

        return carros;
    }

    async listarCarroID(id: number): Promise<Carro | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Carro WHERE id_carro = ?",
            [id]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Carro(
            linha.id_carro, 
            linha.marca, 
            linha.modelo, 
            Number(linha.ano), 
            linha.placa, 
            Number(linha.preco), 
            linha.cor
        );
    }

    async verificaPlaca(placa: string): Promise<Carro | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM Carro WHERE placa = ?",
            [placa]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new Carro(
            linha.id_carro, 
            linha.marca, 
            linha.modelo, 
            Number(linha.ano), 
            linha.placa, 
            Number(linha.preco), 
            linha.cor
        );
    }

    async atualizarCarro(id: number, dadosAtualizados: any): Promise<Carro> {
        const query = "UPDATE Carro SET marca = ?, modelo = ?, ano = ?, placa = ?, preco = ?, cor = ? WHERE id_carro = ?";

        try {
            await executarComandoSQL(query, [
                dadosAtualizados.marca, 
                dadosAtualizados.modelo, 
                dadosAtualizados.ano, 
                dadosAtualizados.placa, 
                dadosAtualizados.preco, 
                dadosAtualizados.cor, 
                id
            ]);
            
            const carroAtualizado = new Carro(
                id, 
                dadosAtualizados.marca, 
                dadosAtualizados.modelo, 
                dadosAtualizados.ano, 
                dadosAtualizados.placa, 
                dadosAtualizados.preco, 
                dadosAtualizados.cor
            );
            
            console.log('Carro atualizado com sucesso:', carroAtualizado);
            return carroAtualizado;
            
        } catch (err: any) {
            console.error(`Erro ao atualizar o carro de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }

    async removerCarroId(id: number): Promise<boolean> {
        const query = "DELETE FROM Carro WHERE id_carro = ?";

        try {
            const resultado = await executarComandoSQL(query, [id]);
            console.log(`Carro de ID ${id} deletado com sucesso.`);
            return resultado.affectedRows > 0;
        } catch (err: any) {
            console.error(`Falha ao deletar o carro de ID ${id} gerando o erro: ${err}`);
            throw err;
        }
    }
}