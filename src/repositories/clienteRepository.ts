import {Cliente} from "../models/Cliente"

export class ClienteRepository{
    private static instance: ClienteRepository;
    private listaClientes: Cliente[] = [];


    private constructor(){}

    public static getInstance(): ClienteRepository{
        if(!this.instance){
            this.instance = new ClienteRepository();
        }
        return this.instance;
    }

    public insereCliente(cliente: Cliente){
        this.listaClientes.push(cliente)
    }

    public listarTodosClientes(): Cliente[] {
        return this.listaClientes;
    }

    public listarClienteID(id:number):Cliente|undefined{
        return this.listaClientes.find(cliente => cliente.id_cliente === id)
    }

    public verificaCpf(cpf:string):Cliente|undefined{
        return this.listaClientes.find(cliente => cliente.cpf === cpf)
    }

    public atualizarCliente(id: number, dadosAtualizados: any): Cliente | undefined {
        const cliente = this.listarClienteID(id);
        
        if (cliente) {
            cliente.nome = dadosAtualizados.nome;
            cliente.cpf = dadosAtualizados.cpf;
            cliente.telefone = dadosAtualizados.telefone;
            cliente.email = dadosAtualizados.email;
            cliente.cidade = dadosAtualizados.cidade;
        }
        
        return cliente;
    }

    public removerClienteId(id: number): boolean {
        const index = this.listaClientes.findIndex(cliente => cliente.id_cliente === id);
        
        if (index !== -1) {
            this.listaClientes.splice(index, 1);
            return true;
        }
        
        return false;
    }

}