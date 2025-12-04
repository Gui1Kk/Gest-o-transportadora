import * as bcrypt from 'bcrypt';
import * as usuarioRepository from '../repository/usuarioRepository';
import * as logRepository from '../repository/logRepository';
import { Usuario } from '../models/usuarioModel';

export async function cadastrarUsuario(nome: string, email: string, senhaAberta: string): Promise<void> {
    const usuarioExistente = await usuarioRepository.buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
        throw new Error("Email já existe");
    }

    const senhaHash = await bcrypt.hash(senhaAberta, 10);
    await usuarioRepository.criarUsuario(nome, email, senhaHash);

    const novoUsuario = await usuarioRepository.buscarUsuarioPorEmail(email);
    if (novoUsuario) {
        await logRepository.criarLog(novoUsuario.id, "Usuário cadastrado com sucesso.");
    }
}

export async function autenticarUsuario(email: string, senhaAberta: string): Promise<Usuario> {
    const usuario = await usuarioRepository.buscarUsuarioPorEmail(email);
    
    if (!usuario) {
        throw new Error("Usuário ou senha incorretos.");
    }

    const senhaValida = await bcrypt.compare(senhaAberta, usuario.senha_hash);

    if (!senhaValida) {
        throw new Error("Usuário ou senha incorretos.");
    }

    return usuario;
}

export async function atualizarEmail(id: number, novoEmail: string): Promise<void> {
    await usuarioRepository.atualizarEmailUsuario(id, novoEmail);
}

export async function deletarUsuario(id: number): Promise<void> {
    await usuarioRepository.deletarUsuario(id);
}

export async function listarTodos() {
    return await usuarioRepository.listarTodosUsuarios();
}