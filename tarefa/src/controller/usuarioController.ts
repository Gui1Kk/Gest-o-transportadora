import * as usuarioService from '../service/usuarioService';
import { Usuario } from '../models/usuarioModel';

export async function cadastrarUsuario(nome: string, email: string, senha: string): Promise<void> {
    try {
        console.log(`⏳ Tentando cadastrar usuário ${nome}...`);
        await usuarioService.cadastrarUsuario(nome, email, senha);
        console.log("✅ Usuário cadastrado com sucesso!");
    } catch (erro: any) {
        console.error("❌ Falha ao cadastrar: " + erro.message);
    }
}

export async function login(email: string, senha: string): Promise<Usuario | null> {
    try {
        const usuario = await usuarioService.autenticarUsuario(email, senha);
        console.log(`👋 Bem-vindo, ${usuario.nome}!`);
        return usuario;
    } catch (erro: any) {
        console.error("❌ Erro de Login: " + erro.message);
        return null;
    }
}

export async function atualizarEmail(id: number, email: string): Promise<void> {
    try {
        await usuarioService.atualizarEmail(id, email);
        console.log("✅ Email atualizado com sucesso!");
    } catch (erro: any) {
        console.error("❌ Erro ao atualizar: " + erro.message);
    }
}

export async function deletarUsuario(id: number): Promise<boolean> {
    try {
        await usuarioService.deletarUsuario(id);
        console.log("🗑️ Usuário deletado com sucesso.");
        return true;
    } catch (erro: any) {
        console.error("❌ Erro ao deletar: " + erro.message);
        return false;
    }
}

export async function listarTodos(): Promise<Usuario[]> {
    try {
        return await usuarioService.listarTodos();
    } catch (erro: any) {
        console.error("❌ Erro ao listar usuários: " + erro.message);
        return [];
    }
}