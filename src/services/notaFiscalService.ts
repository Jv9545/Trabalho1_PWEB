import { NotaFiscal } from "../models/NotaFiscal";
import { NotaFiscalRepository } from "../repositories/notaFiscalRepository";
import { EstoqueRepository } from "../repositories/estoqueRepository";
import { CarroRepository } from "../repositories/carroRepository";
import { ClienteRepository } from "../repositories/clienteRepository";
import { VendedorRepository } from "../repositories/vendedorRepository"; 

export class NotaFiscalService {
    notaFiscalRepositorio: NotaFiscalRepository = NotaFiscalRepository.getInstance();
    estoqueRepositorio: EstoqueRepository = EstoqueRepository.getInstance();
    carroRepositorio: CarroRepository = CarroRepository.getInstance();
    clienteRepositorio: ClienteRepository = ClienteRepository.getInstance();
    vendedorRepositorio: VendedorRepository = VendedorRepository.getInstance();

    async emitirNota(notaInfo: any): Promise<NotaFiscal> {
        const { numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro } = notaInfo;

        if (!numero_nota || !data_emissao || !valor_total || !id_cliente || !id_vendedor || !id_carro) {
            throw new Error("Preencha todos os campos obrigatórios");
        }

        if (valor_total <= 0) {
            throw new Error("O valor total deve ser maior que zero");
        }

        const dataEmissaoObj = new Date(data_emissao);
        const dataAtual = new Date();
        if (dataEmissaoObj > dataAtual) {
            throw new Error("A data de emissão não pode ser maior que a data atual");
        }

        const notaExiste = await this.notaFiscalRepositorio.verificaNumeroNota(numero_nota);
        if (notaExiste !== undefined) {
            throw new Error("Número da nota já existente");
        }

        const idClienteNum = parseInt(id_cliente, 10);
        const idVendedorNum = parseInt(id_vendedor, 10);
        const idCarroNum = parseInt(id_carro, 10);

        const clienteExiste = await this.clienteRepositorio.listarClienteID(idClienteNum);
        if (clienteExiste === undefined) {
            throw new Error("Cliente não encontrado");
        }
        
        const vendedorExiste = await this.vendedorRepositorio.listarVendedorID(idVendedorNum);
        if (vendedorExiste === undefined) {
            throw new Error("Vendedor não encontrado");
        }
        
        const carroExiste = await this.carroRepositorio.listarCarroID(idCarroNum);
        if (carroExiste === undefined) {
            throw new Error("Carro não encontrado");
        }

        const estoque = await this.estoqueRepositorio.verificaCarro(idCarroNum);
        if (estoque === undefined || estoque.quantidade <= 0) {
            throw new Error("Estoque insuficiente");
        }
        
        // Decrementa o estoque efetivamente na base de dados
        await this.estoqueRepositorio.atualizarEstoque(estoque.id_estoque as number, {
            quantidade: estoque.quantidade - 1,
            localizacao_patio: estoque.localizacao_patio
        });

        // Passa null como primeiro parâmetro, pois o ID será gerado pela base de dados
        const novaNota = new NotaFiscal(null, numero_nota, dataEmissaoObj, valor_total, idClienteNum, idVendedorNum, idCarroNum);
        return await this.notaFiscalRepositorio.insereNota(novaNota);
    }

    async listar(): Promise<NotaFiscal[]> {
        return await this.notaFiscalRepositorio.listarTodasNotas();
    }

    async listarID(id: any): Promise<NotaFiscal> {
        const idToNumber: number = parseInt(id, 10);
        const nota = await this.notaFiscalRepositorio.listarNotaID(idToNumber);
        
        if (nota === undefined) {
            throw new Error("Nota fiscal não encontrada");
        }
        
        return nota;
    }
}