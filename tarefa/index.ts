import db from './src/repository/database';
import * as usuarioController from './src/controller/usuarioController';
import * as veiculoController from './src/controller/veiculoController';
import * as entregaController from './src/controller/entregaController';
import * as produtoController from './src/controller/produtoController';
import { Usuario } from './src/models/usuarioModel';

const prompt = require('prompt-sync')();

function pausar() {
    prompt('\n⌨️  Pressione ENTER para continuar...');
}

async function inicializarBanco() {
    const schemas = [
        `CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL, senha_hash TEXT NOT NULL, data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, acao TEXT NOT NULL, data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (usuario_id) REFERENCES usuarios(id))`,
        `CREATE TABLE IF NOT EXISTS veiculos (id INTEGER PRIMARY KEY AUTOINCREMENT, placa TEXT NOT NULL UNIQUE, modelo TEXT NOT NULL, capacidade_kg REAL NOT NULL)`,
        `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, descricao TEXT, peso_unitario_kg REAL NOT NULL)`,
        `CREATE TABLE IF NOT EXISTS entregas (id INTEGER PRIMARY KEY AUTOINCREMENT, veiculo_id INTEGER NOT NULL, motorista_id INTEGER NOT NULL, status TEXT NOT NULL, data_prevista TEXT NOT NULL, endereco_destino TEXT NOT NULL, FOREIGN KEY (veiculo_id) REFERENCES veiculos(id), FOREIGN KEY (motorista_id) REFERENCES usuarios(id))`,
        `CREATE TABLE IF NOT EXISTS itens_de_entregas (id INTEGER PRIMARY KEY AUTOINCREMENT, entrega_id INTEGER NOT NULL, produto_id INTEGER NOT NULL, quantidade INTEGER NOT NULL, FOREIGN KEY (entrega_id) REFERENCES entregas(id), FOREIGN KEY (produto_id) REFERENCES produtos(id))`
    ];
    for (const sql of schemas) {
        await new Promise<void>((resolve, reject) => db.run(sql, (err) => err ? reject(err) : resolve()));
    }
}

let usuarioLogado: Usuario | null = null;

async function menuLogin() {
    while (!usuarioLogado) {
        console.clear();
        console.log("🔒 --- LOGIN NECESSÁRIO --- 🔒");
        console.log("1. Fazer Login");
        console.log("2. Cadastrar Novo Usuário");
        console.log("3. Sair");
        
        const opcao = prompt('Opção: ');

        if (opcao === '1') {
            const email = prompt('Email: ');
            const senha = prompt('Senha: ');
            usuarioLogado = await usuarioController.login(email, senha);
            if (usuarioLogado) pausar(); else { console.log("Tente novamente."); pausar(); }
        } 
        else if (opcao === '2') {
            const nome = prompt('Nome: ');
            const email = prompt('Email: ');
            const senha = prompt('Senha: ');
            await usuarioController.cadastrarUsuario(nome, email, senha);
            pausar();
        } 
        else if (opcao === '3') {
            process.exit(0);
        }
    }
}

async function main() {
    await inicializarBanco();

    await menuLogin();

    while (true) {
        console.clear();
        console.log(`👤 Logado como: ${usuarioLogado?.nome} (ID: ${usuarioLogado?.id})`);
        console.log("========================================");
        console.log("🚛  SISTEMA DE TRANSPORTADORA - MENU  🚛");
        console.log("========================================");
        console.log("1. Gerenciar Usuários");
        console.log("2. Gerenciar Veículos");
        console.log("3. Gerenciar Produtos");
        console.log("4. Agendar Entrega");
        console.log("5. Sair");
        console.log("========================================");
        
        const opcao = prompt('Escolha uma opção: ');

        switch (opcao) {
            case '1':
                console.clear();
                console.log("--- Gerenciar Usuários ---");
                console.log("1. Listar Todos");
                console.log("2. Cadastrar Novo Usuário");
                console.log("3. Editar meu Email");
                console.log("4. Deletar minha conta");
                console.log("5. Voltar");
                
                const opUser = prompt('Opção: ');
                
                if (opUser === '1') {
                    const usuarios = await usuarioController.listarTodos();
                    if (usuarios.length === 0) console.log("Nenhum usuário encontrado."); else console.table(usuarios);
                    pausar();
                } 
                else if (opUser === '2') {
                    console.log("\n--- Novo Usuário ---");
                    const nome = prompt('Nome: ');
                    const email = prompt('Email: ');
                    const senha = prompt('Senha: ');
                    await usuarioController.cadastrarUsuario(nome, email, senha);
                    pausar();
                }
                else if (opUser === '3') {
                    if (usuarioLogado) {
                        console.log(`Email atual: ${usuarioLogado.email}`);
                        const novoEmail = prompt('Novo Email: ');
                        await usuarioController.atualizarEmail(usuarioLogado.id, novoEmail);
                        usuarioLogado.email = novoEmail; 
                    }
                    pausar();
                } 
                else if (opUser === '4') {
                    if (usuarioLogado) {
                        const confirm = prompt('Tem certeza? (s/n): ');
                        if (confirm.toLowerCase() === 's') {
                            const deletou = await usuarioController.deletarUsuario(usuarioLogado.id);
                            if (deletou) {
                                usuarioLogado = null; 
                                await menuLogin();
                            }
                        }
                    }
                    pausar();
                }
                break;

            case '2':
                console.clear();
                console.log("--- Gerenciar Veículos ---");
                console.log("1. Cadastrar Veículo");
                console.log("2. Listar e Gerenciar");
                console.log("3. Voltar");
                const opVeiculo = prompt('Opção: ');

                if (opVeiculo === '1') {
                    const placa = prompt('Placa: ');
                    const modelo = prompt('Modelo: ');
                    const cap = prompt('Capacidade (kg): ');
                    if(usuarioLogado) await veiculoController.cadastrarVeiculo(placa, modelo, Number(cap), usuarioLogado.id);
                    pausar();
                } 
                else if (opVeiculo === '2') {
                    const listaV = await veiculoController.listarTodos();
                    if (listaV.length === 0) {
                        console.log("Vazio.");
                        pausar();
                    } else {
                        console.table(listaV);
                        const idV = prompt('ID do veículo para gerenciar (0 voltar): ');
                        if (idV !== '0') {
                            const veiculo = listaV.find(v => v.id === Number(idV));
                            if (veiculo) {
                                console.log(`\nSelecionado: ${veiculo.modelo}`);
                                console.log("1. Editar Capacidade");
                                console.log("2. Deletar");
                                const acaoV = prompt('Opção: ');
                                if (acaoV === '1') {
                                    const novaCap = prompt('Nova Capacidade: ');
                                    await veiculoController.atualizarCapacidade(veiculo.id, Number(novaCap));
                                } else if (acaoV === '2') {
                                    await veiculoController.deletarVeiculo(veiculo.id);
                                }
                                pausar();
                            }
                        }
                    }
                }
                break;

            case '3':
                console.clear();
                console.log("--- Gerenciar Produtos ---");
                console.log("1. Cadastrar Produto");
                console.log("2. Listar e Gerenciar");
                console.log("3. Voltar");
                const opProd = prompt('Opção: ');

                if (opProd === '1') {
                    const nome = prompt('Nome do Produto: ');
                    const desc = prompt('Descrição: ');
                    const peso = prompt('Peso Unitário (kg): ');
                    await produtoController.cadastrarProduto(nome, desc, Number(peso));
                    pausar();
                }
                else if (opProd === '2') {
                    const listaP = await produtoController.listarTodos();
                    if (listaP.length === 0) {
                        console.log("Nenhum produto cadastrado.");
                        pausar();
                    } else {
                        console.table(listaP);
                        const idP = prompt('ID do produto para gerenciar (0 voltar): ');
                        if (idP !== '0') {
                            const prod = listaP.find(p => p.id === Number(idP));
                            if (prod) {
                                console.log(`\nSelecionado: ${prod.nome}`);
                                console.log("1. Editar Produto");
                                console.log("2. Deletar Produto");
                                const acaoP = prompt('Opção: ');
                                
                                if (acaoP === '1') {
                                    const novoNome = prompt(`Novo Nome (${prod.nome}): `) || prod.nome;
                                    const novaDesc = prompt(`Nova Descrição (${prod.descricao}): `) || prod.descricao;
                                    const novoPeso = prompt(`Novo Peso (${prod.peso_unitario_kg}): `);
                                    await produtoController.atualizarProduto(prod.id, novoNome, novaDesc, Number(novoPeso) || prod.peso_unitario_kg);
                                } else if (acaoP === '2') {
                                    await produtoController.deletarProduto(prod.id);
                                }
                                pausar();
                            }
                        }
                    }
                }
                break;

            case '4':
                console.clear();
                console.log("\n--- 📦 Nova Entrega ---");
                
                const veiculos = await veiculoController.listarTodos();
                if (veiculos.length === 0) { console.log("Sem veículos."); pausar(); break; }
                console.table(veiculos);
                const idVeiculo = prompt('ID do Veículo: ');

                let idMotorista = 0;
                const usarLogado = prompt('\nO motorista é você? (s/n): ');
                if (usarLogado.toLowerCase() === 's' && usuarioLogado) {
                    idMotorista = usuarioLogado.id;
                } else {
                    const motoristas = await usuarioController.listarTodos();
                    console.table(motoristas);
                    idMotorista = Number(prompt('ID do Motorista: '));
                }
                
                const destino = prompt('\nEndereço de Destino: ');
                
                const itens = [];
                console.log("\n--- Adicionando Produtos ---");
                const produtosDisponiveis = await produtoController.listarTodos();
                
                if (produtosDisponiveis.length === 0) {
                    console.log("Sem produtos cadastrados. Cadastre antes de agendar.");
                    pausar();
                    break;
                }

                while(true) {
                    console.clear();
                    console.log("--- Produtos no Carrinho: " + itens.length + " ---");
                    console.table(produtosDisponiveis);
                    const idProd = prompt('ID do Produto (ou 0 para finalizar): ');
                    
                    if (idProd === '0' || idProd === '') break;
                    
                    const prodEncontrado = produtosDisponiveis.find(p => p.id === Number(idProd));
                    if (prodEncontrado) {
                        const qtd = prompt(`Quantidade de '${prodEncontrado.nome}': `);
                        if (Number(qtd) > 0) {
                            itens.push({ produto_id: Number(idProd), quantidade: Number(qtd) });
                        }
                    } else {
                        console.log("ID inválido!");
                        pausar();
                    }
                }

                if (itens.length > 0 && usuarioLogado) {
                    await entregaController.agendarEntrega(
                        Number(idVeiculo), 
                        idMotorista, 
                        new Date(), 
                        destino, 
                        itens, 
                        usuarioLogado.id
                    );
                } else {
                    console.log("⚠️ Nenhum item adicionado.");
                }
                pausar();
                break;

            case '5':
                console.log("Saindo...");
                process.exit(0);

            default:
                console.log("❌ Opção inválida!");
                pausar();
        }
    }
}

main();