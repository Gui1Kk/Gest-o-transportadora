export interface Usuario {
    id: number;
    nome: string;
    email: string; 
    senha_hash: string;
    data_criacao: Date;
}