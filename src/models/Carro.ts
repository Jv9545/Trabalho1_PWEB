export class Carro {
    id_carro: number
    marca: string
    modelo: string
    ano: number
    placa: string
    preco: number
    cor: string
    
    constructor(marca: string, modelo: string, ano: number, placa: string, preco: number, cor: string  ){
        this.marca = marca
        this.modelo = modelo
        this.ano = ano
        this.placa = placa
        this.preco = preco
        this.cor = cor
        this.id_carro = this.geraID()
    }

    private geraID(): number{
        return Date.now()
    }
}