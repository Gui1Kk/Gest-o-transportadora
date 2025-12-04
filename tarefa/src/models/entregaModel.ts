export interface Entrega {
    id: number;
    veiculo_id: number;
    motorista_id: number;
    status: string;
    data_prevista: Date;
    endereco_destino: string;
}