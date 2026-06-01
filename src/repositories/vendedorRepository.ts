import {Vendedor} from "../models/Vendedor"

export class VendedorRepository{
    private static instance: VendedorRepository;
    private listaVendedores: Vendedor[] = [];


    private constructor(){}

    public static getInstance(): VendedorRepository{
        if(!this.instance){
            this.instance = new VendedorRepository();
        }
        return this.instance;
    }

    public insereVendedor(vendedor: Vendedor){
        this.listaVendedores.push(vendedor)
    }

    public listarTodosVendedores(): Vendedor[] {
        return this.listaVendedores;
    }

    public listarVendedorID(id:number):Vendedor|undefined{
        return this.listaVendedores.find(vendedor => vendedor.id_vendedor === id)
    }

    public verificaMatricula(matricula:string):Vendedor|undefined{
        return this.listaVendedores.find(vendedor => vendedor.matricula === matricula)
    }

    public atualizarVendedor(id: number, dadosAtualizados: any): Vendedor | undefined {
        const vendedor = this.listarVendedorID(id);
        
        if (vendedor) {
            vendedor.nome = dadosAtualizados.nome;
            vendedor.matricula = dadosAtualizados.matricula;
            vendedor.comissao_percentual = dadosAtualizados.comissao_percentual
        }
        
        return vendedor;
    }

    public removerVendedorId(id: number): boolean {
        const index = this.listaVendedores.findIndex(vendedor => vendedor.id_vendedor === id);
        
        if (index !== -1) {
            this.listaVendedores.splice(index, 1);
            return true;
        }
        
        return false;
    }

}