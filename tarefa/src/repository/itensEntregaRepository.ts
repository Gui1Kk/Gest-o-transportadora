import { ItemEntrega } from "../models/itensEntregaModel";
import db from "./database";

export function adicionarItemEntrega(entrega_id: number, produto_id: number, quantidade: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sql =`
            INSERT INTO itens_de_entregas (entrega_id, produto_id, quantidade) VALUES (?, ?, ?)
        `
            
        db.run(sql, [entrega_id, produto_id, quantidade], (erro) => {
            if (erro) {
                reject(erro);
            } else {
                resolve();
            }
        });
    });
}