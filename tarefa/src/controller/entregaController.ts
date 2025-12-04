import * as entregaService from '../service/entregaService';

type ItemInput = {
    produto_id: number;
    quantidade: number;
};

export async function agendarEntrega(
    veiculo_id: number, 
    motorista_id: number, 
    data_prevista: Date, 
    endereco_destino: string, 
    itens: ItemInput[], 
    idUsuarioLogado: number
): Promise<void> {
    try {
        console.log("⏳ Tentando agendar entrega...");
        console.log(`📦 Quantidade de itens: ${itens.length}`);

        await entregaService.agendarEntrega(veiculo_id, motorista_id, data_prevista, endereco_destino, itens, idUsuarioLogado);

        console.log("✅ Entrega agendada com sucesso! Log registrado.");
    } catch (erro: any) {
        console.error("❌ Falha ao agendar entrega: " + erro.message);
    }
}