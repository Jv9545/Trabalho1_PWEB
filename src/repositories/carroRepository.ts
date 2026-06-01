import {Carro} from "../models/Carro"

export class CarroRepository{
    private static instance: CarroRepository;
    private listaCarro: Carro[] = [];


    private constructor(){}

    public static getInstance(): CarroRepository{
        if(!this.instance){
            this.instance = new CarroRepository();
        }
        return this.instance;
    }

    public insereCarro(carro: Carro){
        this.listaCarro.push(carro)
    }

    public listarTodosCarros(): Carro[] {
        return this.listaCarro;
    }

    public listarCarroID(id:number):Carro|undefined{
        return this.listaCarro.find(cliente => cliente.id_carro === id)
    }

    public verificaPlaca(placa:string):Carro|undefined{
        return this.listaCarro.find(cliente => cliente.placa === placa)
    }

    public atualizarCarro(id: number, dadosAtualizados: any): Carro | undefined {
        const carro = this.listarCarroID(id);
        if (carro) {
            carro.marca = dadosAtualizados.marca;
            carro.modelo = dadosAtualizados.modelo;
            carro.ano = dadosAtualizados.ano;
            carro.placa = dadosAtualizados.placa;
            carro.preco = dadosAtualizados.preco;
            carro.cor = dadosAtualizados.cor;
        }
        
        return carro;
    }

    public removerCarroId(id: number): boolean {
        const index = this.listaCarro.findIndex(carro => carro.id_carro === id);
        
        if (index !== -1) {
            this.listaCarro.splice(index, 1);
            return true;
        }
        
        return false;
    }
    
}