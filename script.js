const SENHA_ADM = "2307";

let produtos = JSON.parse(localStorage.getItem('produtos_fav_mimos')) || [
    { id: 1, nome: "Colônia Infantil Cheirinho de Amor", categoria: "infantil", preco: 35.90, imagem: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&auto=format&fit=crop&q=60" },
    { id: 2, nome: "Kit Maquiagem Completo Glow", categoria: "maquiagem", preco: 89.90, imagem: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=60" },
    { id: 3, nome: "Necessaire de Higiene Pessoal", categoria: "higiene", preco: 29.90, imagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60" },
    { id: 4, nome: "Hidratante Corporal Desodorante", categoria: "hidratante", preco: 42.00, imagem: "https://images.unsplash.com/photo-1608248597359-994c6d3bc224?w=400&auto=format&fit=crop&q=60" },
    { id: 5, nome: "Body Splash Vanilla Kiss", categoria: "bodysplash", preco: 49.90, imagem: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=60" },
    { id: 6, nome: "Relógio Feminino Rosé Elegance", categoria: "relogio", preco: 120.00, imagem: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=60" },
    { id: 7, nome: "Protetor Térmico Capilar", categoria: "cabelo", preco: 38.00, imagem: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop&q=60" },
    { id: 8, nome: "Spray Capilar Fixador / Brilho", categoria: "cabelo", preco: 34.90, imagem: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=60" },
    { id: 9, nome: "Sabonete Íntimo Delicado", categoria: "intimo", preco: 22.50, imagem: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=60" },
    { id: 10, nome: "Perfume Sensual / Sedutor", categoria: "bodysplash", preco: 65.00, imagem: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=60" },
    { id: 11, nome: "Água Micelar Limpeza Facial", categoria: "intimo", preco: 27.90, imagem: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=60" }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho_fav_mimos')) || [];
let historicoVendas = JSON.parse(localStorage.getItem('historico_vendas_mimos')) || [];
let categoriaAtual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
});

function renderizarProdutos(filtro = categoriaAtual) {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return;
    vitrine.innerHTML = '';

    const produtosFiltrados = filtro === 'todos' 
        ? produtos 
        : produtos.filter(p => p.categoria === filtro);

    if (produtosFiltrados.length === 0) {
        vitrine.innerHTML = '<p class="col-span-full text-center text-slate-500 py-12 text-sm">Nenhum produto encontrado.</p>';
        return;
    }

    produtosFiltrados.forEach(produto => {
        vitrine.innerHTML += `
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                <div class="h-48 overflow-hidden bg-slate-100">
                    <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                </div>
                <div class="p-4 flex flex-col flex-1 justify-between">
                    <div>
                        <span class="text-xs font-semibold text-pink-500 uppercase tracking-wider">${produto.categoria}</span>
                        <h3 class="font-bold text-slate-800 mt-1">${produto.nome}</h3>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-lg font-bold text-slate-900">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button onclick="adicionarAoCarrinho(${produto.id})" class="bg-pink-100 text-pink-600 p-2.5 rounded-xl hover:bg-pink-600 hover:text-white transition">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filtrarProdutos(categoria, elemento) {
    categoriaAtual = categoria;
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('bg-pink-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600');
    });
    
    if (elemento) {
        elemento.classList.remove('bg-white', 'text-slate-600');
        elemento.classList.add('bg-pink-600', 'text-white');
    }
    
    renderizarProdutos(categoria);
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if(item) {
        item.quantidade += delta;
        if(item.quantidade <= 0) carrinho = carrinho.filter(i => i.id !== id);
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    localStorage.setItem('carrinho_fav_mimos', JSON.stringify(carrinho));
    const lista = document.getElementById('lista-carrinho');
    const badgeInferior = document.getElementById('badge-carrinho-inferior');
    const valorTotal = document.getElementById('valor-total');
    
    if (!lista) return;

    lista.innerHTML = '';
    let total = 0;
    let qtdTotal = 0;

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        qtdTotal += item.quantidade;

        lista.innerHTML += `
            <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <div>
                    <h4 class="font-semibold text-sm text-slate-800">${item.nome}</h4>
                    <span class="text-xs text-slate-500">R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center bg-white border border-slate-200 rounded-lg">
                        <button onclick="alterarQuantidade(${item.id}, -1)" class="px-2 py-0.5 text-slate-600 font-bold">-</button>
                        <span class="px-2 text-slate-800 font-bold text-xs">${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${item.id}, 1)" class="px-2 py-0.5 text-slate-600 font-bold">+</button>
                    </div>
                    <button onclick="removerDoCarrinho(${item.id})" class="text-red-400 hover:text-red-600 text-sm">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    if (badgeInferior) {
        if (qtdTotal > 0) {
            badgeInferior.innerText = qtdTotal;
            badgeInferior.classList.remove('hidden');
        } else {
            badgeInferior.classList.add('hidden');
        }
    }

    if (valorTotal) {
        valorTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

function toggleCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    if (modal) {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    }
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let totalVenda = 0, msgItens = "";
    carrinho.forEach(item => {
        totalVenda += item.preco * item.quantidade;
        msgItens += `- ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
    });

    historicoVendas.push({
        data: new Date().toISOString(),
        total: totalVenda
    });
    localStorage.setItem('historico_vendas_mimos', JSON.stringify(historicoVendas));

    const mensagem = encodeURIComponent(`Olá! Gostaria de fazer o pedido dos seguintes mimos da *Fav.mimos*:\n\n${msgItens}\n*Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}*`);
    
    carrinho = [];
    atualizarCarrinho();
    toggleCarrinho();

    const seuNumeroWhatsApp = "5522999999999"; 
    window.open(`https://wa.me/${seuNumeroWhatsApp}?text=${mensagem}`, '_blank');
}

// Funções do Painel Administrativo com Senha
function abrirPainelAdm() {
    const modal = document.getElementById('modal-adm');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function fecharPainelAdm() {
    const modal = document.getElementById('modal-adm');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
    document.getElementById('bloco-senha').classList.remove('hidden');
    document.getElementById('bloco-conteudo-adm').classList.add('hidden');
    document.getElementById('input-senha').value = '';
    document.getElementById('erro-senha').classList.add('hidden');
}

function verificarSenha() {
    const inputSenha = document.getElementById('input-senha');
    if(inputSenha && inputSenha.value === SENHA_ADM) {
        document.getElementById('bloco-senha').classList.add('hidden');
        document.getElementById('bloco-conteudo-adm').classList.remove('hidden');
        carregarRelatorios();
        carregarCrudProdutos();
    } else {
        const erroSenha = document.getElementById('erro-senha');
        if(erroSenha) erroSenha.classList.remove('hidden');
    }
}

function mudarAbaAdm(aba) {
    const btnRel = document.getElementById('tab-btn-relatorios');
    const btnProd = document.getElementById('tab-btn-produtos');
    const divRel = document.getElementById('aba-relatorios');
    const divProd = document.getElementById('aba-produtos');

    if (aba === 'relatorios') {
        btnRel.className = "flex-1 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white transition";
        btnProd.className = "flex-1 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition";
        divRel.classList.remove('hidden');
        divProd.classList.add('hidden');
    } else {
        btnProd.className = "flex-1 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white transition";
        btnRel.className = "flex-1 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition";
        divProd.classList.remove('hidden');
        divRel.classList.add('hidden');
    }
}

function salvarProduto() {
    const nome = document.getElementById('prod-nome').value.trim();
    const categoria = document.getElementById('prod-categoria').value.trim() || 'geral';
    const preco = parseFloat(document.getElementById('prod-preco').value);

    if (!nome || isNaN(preco)) return alert("Preencha os campos!");
    produtos.push({ id: produtos.length + 1, nome, categoria, preco, imagem: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&auto=format&fit=crop&q=60" });
    localStorage.setItem('produtos_fav_mimos', JSON.stringify(produtos));
    renderizarProdutos();
    alert("Produto salvo!");
}
