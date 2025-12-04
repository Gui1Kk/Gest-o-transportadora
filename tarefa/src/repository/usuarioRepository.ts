import { Usuario } from '../models/usuarioModel';
import db from "./database";

export function criarUsuario(nome: string, email: string, senha_hash: string): Promise<void> {
    const sql = `
        INSERT INTO usuarios (nome, email, senha_hash)
        VALUES (?, ?, ?);
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [nome, email, senha_hash], (erro) => {

            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function buscarUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
    const sql = `
    SELECT * FROM usuarios WHERE email = ?;
    `;

    return new Promise((resolve, reject) => {
        db.get(sql, [email], (erro, linha: Usuario) => {

            if (erro) {
                reject(erro);
            } else {
                resolve(linha);
            }
        });
    });
}   

export function deletarUsuario(id: number): Promise<void> {
    const sql= `
        DELETE FROM usuarios WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [id], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function atualizarEmailUsuario(id: number, novoEmail: string): Promise<void> {
    const sql= `
        UPDATE usuarios SET email = ? WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [novoEmail, id], (erro) => {
            
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function listarTodosUsuarios(): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, nome, email, data_criacao FROM usuarios";
        db.all(sql, [], (erro, linhas: Usuario[]) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linhas);
            }
        });
    });
}