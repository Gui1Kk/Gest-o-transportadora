import * as logRepository from '../repository/logRepository';

export async function registrarLog(usuario_id: number, acao: string): Promise<void> {

    await logRepository.criarLog(usuario_id, acao);
}