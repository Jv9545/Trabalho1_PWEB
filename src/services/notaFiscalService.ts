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

    emitirNota(notaInfo: any): NotaFiscal {
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

        if (this.notaFiscalRepositorio.verificaNumeroNota(numero_nota) !== undefined) {
            throw new Error("Número da nota já existente");
        }

        const idClienteNum = parseInt(id_cliente, 10);
        const idVendedorNum = parseInt(id_vendedor, 10);
        const idCarroNum = parseInt(id_carro, 10);

        if (this.clienteRepositorio.listarClienteID(idClienteNum) === undefined) {
            throw new Error("Cliente não encontrado");
        }
        if (this.vendedorRepositorio.listarVendedorID(idVendedorNum) === undefined) {
            throw new Error("Vendedor não encontrado");
        }
        if (this.carroRepositorio.listarCarroID(idCarroNum) === undefined) {
            throw new Error("Carro não encontrado");
        }

        const estoque = this.estoqueRepositorio.verificaCarro(idCarroNum);
        if (estoque === undefined || estoque.quantidade <= 0) {
            throw new Error("Estoque insuficiente");
        }
        
        estoque.quantidade -= 1;

        const novaNota = new NotaFiscal(numero_nota, dataEmissaoObj, valor_total, idClienteNum, idVendedorNum, idCarroNum);
        this.notaFiscalRepositorio.insereNota(novaNota);
        
        return novaNota;
    }

    listar(): NotaFiscal[] {
        return this.notaFiscalRepositorio.listarTodasNotas();
    }

    listarID(id: any): NotaFiscal {
        const idToNumber: number = parseInt(id, 10);
        const nota = this.notaFiscalRepositorio.listarNotaID(idToNumber);
        if (nota === undefined) {
            throw new Error("Nota fiscal não encontrada");
        }
        return nota;
    }
}