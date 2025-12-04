import * as produtoService from '../service/produtoService';
import { Produto } from '../models/produtoModel';

export async function cadastrarProduto(nome: string, descricao: string, peso: number): Promise<void> {
    try {
        console.log(` Cadastrando produto ${nome}...`);
        await produtoService.cadastrarProduto(nome, descricao, peso);
        console.log(" Produto cadastrado com sucesso!");
    } catch (erro: any) {
        console.error(" Erro: " + erro.message);
    }
}

export async function listarTodos(): Promise<Produto[]> {
    try {
        return await produtoService.listarTodos();
    } catch (erro: any) {
        console.error(" Erro ao listar: " + erro.message);
        return [];
    }
}

export async function atualizarProduto(id: number, nome: string, descricao: string, peso: number): Promise<void> {
    try {
        await produtoService.atualizarProduto(id, nome, descricao, peso);
        console.log(" Produto atualizado!");
    } catch (erro: any) {
        console.error(" Erro: " + erro.message);
    }
}

export async function deletarProduto(id: number): Promise<void> {
    try {
        await produtoService.deletarProduto(id);
        console.log(" Produto deletado.");
    } catch (erro: any) {
        console.error(" Erro: " + erro.message);
    }
}