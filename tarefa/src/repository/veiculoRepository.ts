import { Veiculo } from "../models/veiculoModel";
import db from "./database";

export function criarVeiculo(placa: string, modelo: string, capacidade_kg: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO veiculos (placa, modelo, capacidade_kg)
            VALUES (?, ?, ?);
        `;
        db.run(sql, [placa, modelo, capacidade_kg], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function buscarVeiculoPorPlaca(placa: string): Promise<Veiculo | undefined> {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM veiculos WHERE placa = ?;
            `;

        db.get(sql, [placa], (erro, linha: Veiculo) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linha);
            }
        });
    });
}

export function deletarVeiculo(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM veiculos WHERE id = ?;
            `
            db.run(sql, [id], (erro) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve();
                }
        });
    });
}

export function atualizarCapacidadeVeiculo(id: number, novaCapacidade: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE veiculos SET capacidade_kg = ? WHERE id = ?;
        `;
        db.run(sql, [novaCapacidade, id], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function buscarVeiculoPorId(id: number): Promise<Veiculo | undefined> {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM veiculos WHERE id = ?;
        `;
        db.get(sql, [id], (erro, linha: Veiculo) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linha);
            }
        });
    });
}

export function listarTodosVeiculos(): Promise<Veiculo[]> {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM veiculos";
        db.all(sql, [], (erro, linhas: Veiculo[]) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(linhas);
            }
        });
    });
}