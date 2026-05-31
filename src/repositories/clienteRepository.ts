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

}