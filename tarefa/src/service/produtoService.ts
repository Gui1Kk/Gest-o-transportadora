import * as produtoRepository from '../repository/produtoRepository';

export async function cadastrarProduto(nome: string, descricao: string, peso: number): Promise<void> {
    const produtoExistente = await produtoRepository.buscarProdutoPorNome(nome);
    if (produtoExistente) {
        throw new Error("Já existe um produto com este nome.");
    }
    if (peso <= 0) {
        throw new Error("O peso deve ser maior que zero.");
    }

    await produtoRepository.criarProduto(nome, descricao, peso);
}

export async function listarTodos() {
    return await produtoRepository.listarTodosProdutos();
}

export async function atualizarProduto(id: number, nome: string, descricao: string, peso: number): Promise<void> {
    const produto = await produtoRepository.buscarProdutoPorId(id);
    if (!produto) {
        throw new Error("Produto não encontrado.");
    }
    
    if (peso <= 0) throw new Error("Peso inválido.");

    await produtoRepository.atualizarProduto(id, nome, descricao, peso);
}

export async function deletarProduto(id: number): Promise<void> {
    await produtoRepository.deletarProduto(id);
}