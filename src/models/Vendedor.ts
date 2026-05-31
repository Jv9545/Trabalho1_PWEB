export class Vendedor {
    id_vendedor: number
    nome: string
    matricula: string
    comissao_percentual: number
    
    constructor(nome:string, matricula:string, comissao_percentual: number){
        this.nome = nome
        this.matricula = matricula
        this.comissao_percentual = comissao_percentual
        this.id_vendedor = this.geraID()
    }

    private geraID(): number{
        return Date.now()
    }
}