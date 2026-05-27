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

    public cadastroCliente(cliente: Cliente){
        this.listaClientes.push(cliente)
    }
   


}