import * as log from "../models/logModel";
import db from "./database";

export function criarLog(usuario_id: number, acao: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO logs (usuario_id, acao) VALUES (?, ?)
        `;

        db.run(sql, [usuario_id, acao], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}