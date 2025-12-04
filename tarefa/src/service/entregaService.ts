import * as entregaRepository from '../repository/entregaRepository';
import * as itensEntregaRepository from '../repository/itensEntregaRepository';
import * as veiculoRepository from '../repository/veiculoRepository';
import * as produtoRepository from '../repository/produtoRepository';
import * as logService from './logService';

type ItemInput = {
    produto_id: number;
    quantidade: number;
};

export async function agendarEntrega(veiculo_id: number, motorista_id: number, data_prevista: Date, endereco_destino: string, itens: ItemInput[], idUsuarioLogado: number): Promise<void> {

    const veiculo = await veiculoRepository.buscarVeiculoPorId(veiculo_id);
    if (!veiculo) {
        throw new Error(`Veículo com ID ${veiculo_id} não encontrado`);
    }

    let pesoTotal = 0;
    for (const item of itens) {
        const produto = await produtoRepository.buscarProdutoPorId(item.produto_id);
        
        if (!produto) {
            throw new Error(`Produto com ID ${item.produto_id} não encontrado.`);
        }

        pesoTotal += produto.peso_unitario_kg * item.quantidade;
    }

    console.log(`Peso total calculado: ${pesoTotal}kg. Capacidade do veículo: ${veiculo.capacidade_kg}kg.`);

    if (pesoTotal > veiculo.capacidade_kg) {
        throw new Error(`Capacidade excedida! O veículo suporta ${veiculo.capacidade_kg}kg, mas a carga tem ${pesoTotal}kg.`);
    }

    const entregaId = await entregaRepository.criarEntrega(
        veiculo_id, 
        motorista_id, 
        "PENDENTE", 
        data_prevista, 
        endereco_destino
    );

    for (const item of itens) {
        await itensEntregaRepository.adicionarItemEntrega(entregaId, item.produto_id, item.quantidade);
    }

    await logService.registrarLog(idUsuarioLogado, `Entrega agendada: ID ${entregaId} com ${itens.length} tipos de produtos.`);
}