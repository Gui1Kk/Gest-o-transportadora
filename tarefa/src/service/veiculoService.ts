import * as veiculoRepository from '../repository/veiculoRepository';
import * as logService from './logService';

export async function cadastrarVeiculo(placa: string, modelo: string, capacidade:number, idUsuario: number): Promise<void> {

    const veiculoExistente = await veiculoRepository.buscarVeiculoPorPlaca(placa);

    if (veiculoExistente) {
        throw new Error("Veículo já cadastrado");
    }

    await veiculoRepository.criarVeiculo(placa, modelo, capacidade);
    await logService.registrarLog(idUsuario, `Veículo cadastrado: ${modelo} - Placa: ${placa}`);
}

export async function listarVeiculoPorPlaca(placa: string) {
    const veiculo = await veiculoRepository.buscarVeiculoPorPlaca(placa);
    
    if (!veiculo) {
        throw new Error("Veículo não encontrado.");
    }
    
    return veiculo;
}

export async function listarTodos() {
    return await veiculoRepository.listarTodosVeiculos();
}