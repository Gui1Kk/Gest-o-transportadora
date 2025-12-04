import * as veiculoService from '../service/veiculoService';
import * as veiculoRepository from '../repository/veiculoRepository';

export async function cadastrarVeiculo(placa: string, modelo: string, capacidade: number, idUsuarioLogado: number): Promise<void> {
    try {
        console.log(`⏳ Cadastrando veículo ${placa}...`);
        await veiculoService.cadastrarVeiculo(placa, modelo, capacidade, idUsuarioLogado);
        console.log("✅ Veículo cadastrado!");
    } catch (erro: any) {
        console.error("❌ Erro: " + erro.message);
    }
}

export async function atualizarCapacidade(id: number, novaCapacidade: number): Promise<void> {
    try {
        await veiculoRepository.atualizarCapacidadeVeiculo(id, novaCapacidade);
        console.log("✅ Capacidade atualizada!");
    } catch (erro: any) {
        console.error("❌ Erro: " + erro.message);
    }
}

export async function deletarVeiculo(id: number): Promise<void> {
    try {
        await veiculoRepository.deletarVeiculo(id);
        console.log("🗑️ Veículo deletado.");
    } catch (erro: any) {
        console.error("❌ Erro: " + erro.message);
    }
}

export async function listarVeiculo(placa: string): Promise<void> {
    try {
        const veiculo = await veiculoService.listarVeiculoPorPlaca(placa);
        console.log("🚛 Dados do Veículo:", veiculo);
    } catch (erro: any) {
        console.error("❌ Erro: " + erro.message);
    }
}

import { Veiculo } from '../models/veiculoModel';

export async function listarTodos(): Promise<Veiculo[]> {
    try {
        return await veiculoService.listarTodos();
    } catch (erro: any) {
        console.error("❌ Erro ao listar veículos: " + erro.message);
        return [];
    }
}