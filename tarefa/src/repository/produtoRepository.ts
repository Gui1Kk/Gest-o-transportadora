import { Produto } from "../models/produtoModel";
import db from "./database";

export function criarProduto(nome: string, descricao: string, peso_unitario_kg: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO produtos (nome, descricao, peso_unitario_kg) VALUES (?, ?, ?)
        `;

        db.run(sql, [nome, descricao, peso_unitario_kg], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function buscarProdutoPorNome(nome: string): Promise<Produto | undefined> {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM produtos WHERE nome = ?
        `;

        db.get(sql, [nome], (erro, linha: Produto) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linha);
            }
        });
    });
}

export function buscarProdutoPorId(id: number): Promise<Produto | undefined> {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM produtos WHERE id = ?
        `;

        db.get(sql, [id], (erro, linha: Produto) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linha);
            }
        });
    });
}

export function listarTodosProdutos(): Promise<Produto[]> {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM produtos
        `;

        db.all(sql, [], (erro, linhas: Produto[]) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linhas);
            }
        });
    });
}

export function atualizarProduto(id: number, nome: string, descricao: string, peso: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE produtos SET nome = ?, descricao = ?, peso_unitario_kg = ? WHERE id = ?
        `;

        db.run(sql, [nome, descricao, peso, id], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function deletarProduto(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM produtos WHERE id = ?
        `;

        db.run(sql, [id], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}