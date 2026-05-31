import { NotaFiscal } from "../models/NotaFiscal";

export class NotaFiscalRepository {
    private static instance: NotaFiscalRepository;
    private listaNotasFiscais: NotaFiscal[] = [];

    private constructor() {}

    public static getInstance(): NotaFiscalRepository {
        if (!this.instance) {
            this.instance = new NotaFiscalRepository();
        }
        return this.instance;
    }

    public insereNota(nota: NotaFiscal) {
        this.listaNotasFiscais.push(nota);
    }

    public listarTodasNotas(): NotaFiscal[] {
        return this.listaNotasFiscais;
    }

    public listarNotaID(id: number): NotaFiscal | undefined {
        return this.listaNotasFiscais.find(nota => nota.id_nota === id);
    }

    public verificaNumeroNota(numero_nota: string): NotaFiscal | undefined {
        return this.listaNotasFiscais.find(nota => nota.numero_nota === numero_nota);
    }
}