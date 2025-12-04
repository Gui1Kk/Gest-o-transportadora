import { Entrega } from "../models/entregaModel";
import db from "./database";

export function criarEntrega(veiculo_id: number, motorista_id: number, status: string, data_prevista: Date, endereco_destino: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO entregas (veiculo_id, motorista_id, status, data_prevista, endereco_destino) VALUES (?, ?, ?, ?, ?)
        `;

        db.run(sql, [veiculo_id, motorista_id, status, data_prevista.toISOString(), endereco_destino], function(erro) {
            if (erro) {
                reject(erro);
            } else {
                resolve(this.lastID); 
            }                
        });
    });
}

export function buscarEntregasPorVeiculo(veiculo_id: number): Promise<Entrega[]> {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM entregas WHERE veiculo_id = ?
        `

        db.all(sql, [veiculo_id], (erro, linhas: Entrega[]) => {
           if (erro) {
                reject (erro);
           } else {
                resolve(linhas);
           }
        });
    });
}

export function atualizarStatusEntrega(id: number, novoStatus: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE entregas SET status = ? WHERE id = ?
        `

        db.run(sql, [novoStatus, id], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}

export function deletarEntrega(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM entregas WHERE id = ?
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