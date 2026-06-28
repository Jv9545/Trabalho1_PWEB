import { executarComandoSQL } from "../database/mysql";
import { NotaFiscal } from "../models/NotaFiscal";

export class NotaFiscalRepository {
    private static instance: NotaFiscalRepository;

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS NotaFiscal (
            id_nota INT AUTO_INCREMENT PRIMARY KEY, 
            numero_nota VARCHAR(50) NOT NULL UNIQUE, 
            data_emissao DATETIME NOT NULL,
            valor_total DECIMAL(10,2) NOT NULL,
            id_cliente INT NOT NULL,
            id_vendedor INT NOT NULL,
            id_carro INT NOT NULL
        );
        `;
    }

    private constructor() {}

    public static getInstance(): NotaFiscalRepository {
        if (!this.instance) {
            this.instance = new NotaFiscalRepository();
        }
        return this.instance;
    }

    async insereNota(nota: NotaFiscal): Promise<NotaFiscal> {
        const resultado = await executarComandoSQL(
            "INSERT INTO NotaFiscal (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro) VALUES (?, ?, ?, ?, ?, ?)",
            [nota.numero_nota, nota.data_emissao, nota.valor_total, nota.id_cliente, nota.id_vendedor, nota.id_carro]
        );

        const idGerado = resultado.insertId;

        const novaNota = new NotaFiscal(
            idGerado, 
            nota.numero_nota, 
            nota.data_emissao, 
            nota.valor_total, 
            nota.id_cliente, 
            nota.id_vendedor, 
            nota.id_carro
        );

        console.log('Nota fiscal inserida com sucesso:', novaNota);
        return novaNota;
    }

    async listarTodasNotas(): Promise<NotaFiscal[]> {
        const linhas = await executarComandoSQL("SELECT * FROM NotaFiscal", []);

        const notas: NotaFiscal[] = linhas.map((linha: any) => {
            return new NotaFiscal(
                linha.id_nota, 
                linha.numero_nota, 
                new Date(linha.data_emissao), 
                Number(linha.valor_total), 
                Number(linha.id_cliente), 
                Number(linha.id_vendedor), 
                Number(linha.id_carro)
            );
        });

        return notas;
    }

    async listarNotaID(id: number): Promise<NotaFiscal | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM NotaFiscal WHERE id_nota = ?",
            [id]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new NotaFiscal(
            linha.id_nota, 
            linha.numero_nota, 
            new Date(linha.data_emissao), 
            Number(linha.valor_total), 
            Number(linha.id_cliente), 
            Number(linha.id_vendedor), 
            Number(linha.id_carro)
        );
    }

    async verificaNumeroNota(numero_nota: string): Promise<NotaFiscal | undefined> {
        const linhas = await executarComandoSQL(
            "SELECT * FROM NotaFiscal WHERE numero_nota = ?",
            [numero_nota]
        );

        if (linhas.length === 0) {
            return undefined;
        }

        const linha = linhas[0];
        return new NotaFiscal(
            linha.id_nota, 
            linha.numero_nota, 
            new Date(linha.data_emissao), 
            Number(linha.valor_total), 
            Number(linha.id_cliente), 
            Number(linha.id_vendedor), 
            Number(linha.id_carro)
        );
    }
}