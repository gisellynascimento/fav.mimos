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

let bairrosTaxas = JSON.parse(localStorage.getItem('bairros_taxas_fav_mimos')) || [
    { id: 1, nome: "Centro", taxa: 5.00 },
    { id: 2, nome: "Pelinca", taxa: 6.00 },
    { id: 3, nome: "Parque Tamandaré", taxa: 7.00 },
    { id: 4, nome: "Guarus", taxa: 10.00 }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho_fav_mimos')) || [];
let historicoVendas = JSON.parse(localStorage.getItem('historico_vendas_mimos')) || [];
let categoriaAtual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    carregarSelectBairros();
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

function carregarSelectBairros() {
    const select = document.getElementById('select-bairro');
    if (!select) return;

    select.innerHTML = '';
    bairrosTaxas.forEach(b => {
        select.innerHTML += `<option value="${b.taxa}">${b.nome} - R$ ${b.taxa.toFixed(2).replace('.', ',')}</option>`;
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
    
    if (!lista) return;

    lista.innerHTML = '';
    let subtotal = 0;
    let qtdTotal = 0;

    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade;
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

    // Exibe Bairro e Endereço ao selecionar "Entrega"
    const tipoEntrega = document.getElementById('tipo-entrega')?.value;
    const boxDadosEntrega = document.getElementById('box-dados-entrega');
    const linhaTaxaResumo = document.getElementById('linha-taxa-resumo');
    const valorTaxaExibido = document.getElementById('valor-taxa-exibido');
    const selectBairro = document.getElementById('select-bairro');

    let taxa = 0;
    if (tipoEntrega === 'entrega') {
        boxDadosEntrega?.classList.remove('hidden');
        linhaTaxaResumo?.classList.remove('hidden');
        taxa = parseFloat(selectBairro?.value) || 0;
        if (valorTaxaExibido) valorTaxaExibido.innerText = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
    } else {
        boxDadosEntrega?.classList.add('hidden');
        linhaTaxaResumo?.classList.add('hidden');
    }

    let totalFinal = subtotal + taxa;

    document.getElementById('valor-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('valor-total').innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
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
    if (carrinho.length === 0) return;

    const tipoEntrega = document.getElementById('tipo-entrega').value;
    const selectBairro = document.getElementById('select-bairro');
    const inputEndereco = document.getElementById('input-endereco');
    const erroEndereco = document.getElementById('erro-endereco');

    let detalheEntrega = "";
    let taxaEntrega = 0;

    if (tipoEntrega === 'entrega') {
        const enderecoTexto = inputEndereco.value.trim();
        if (!enderecoTexto) {
            if(erroEndereco) erroEndereco.classList.remove('hidden');
            inputEndereco.focus();
            return;
        }
        if(erroEndereco) erroEndereco.classList.add('hidden');

        const bairroTexto = selectBairro?.options[selectBairro.selectedIndex]?.text || '';
        taxaEntrega = parseFloat(selectBairro.value) || 0;
        detalheEntrega = `🚚 *Entrega a Domicílio*\n📍 *Bairro:* ${bairroTexto}\n🏠 *Endereço:* ${enderecoTexto}`;
    } else {
        detalheEntrega = `🛍️ *Retirada no Local*`;
    }

    const formaPagamento = document.getElementById('forma-pagamento').value;

    let subtotal = 0, msgItens = "";
    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade;
        msgItens += `- ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')})\n`;
    });

    const totalFinal = subtotal + taxaEntrega;

    historicoVendas.push({
        data: new Date().toISOString(),
        total: totalFinal
    });
    localStorage.setItem('historico_vendas_mimos', JSON.stringify(historicoVendas));

    const mensagemText = `Olá! Gostaria de fazer o seguinte pedido na *Fav.mimos*:\n\n` +
        `${msgItens}\n` +
        `-------------------------------\n` +
        `${detalheEntrega}\n` +
        `💳 *Forma de Pagamento:* ${formaPagamento}\n` +
        `💰 *Total Final: R$ ${totalFinal.toFixed(2).replace('.', ',')}*`;

    const mensagem = encodeURIComponent(mensagemText);
    
    carrinho = [];
    atualizarCarrinho();
    toggleCarrinho();

    const seuNumeroWhatsApp = "5522999999999"; 
    window.open(`https://wa.me/${seuNumeroWhatsApp}?text=${mensagem}`, '_blank');
}

// Painel ADM
function abrirPainelAdm() {
    const modal = document.getElementById('modal-adm');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('corpo-pagina').classList.add('overflow-hidden', 'h-screen');
    }
}

function fecharPainelAdm() {
    const modal = document.getElementById('modal-adm');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.getElementById('corpo-pagina').classList.remove('overflow-hidden', 'h-screen');
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
        carregarCrudTaxas();
    } else {
        const erroSenha = document.getElementById('erro-senha');
        if(erroSenha) erroSenha.classList.remove('hidden');
    }
}

function mudarAbaAdm(aba) {
    const btnRel = document.getElementById('tab-btn-relatorios');
    const btnProd = document.getElementById('tab-btn-produtos');
    const btnTaxas = document.getElementById('tab-btn-taxas');
    
    const divRel = document.getElementById('aba-relatorios');
    const divProd = document.getElementById('aba-produtos');
    const divTaxas = document.getElementById('aba-taxas');

    [btnRel, btnProd, btnTaxas].forEach(b => b.className = "flex-1 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition");
    [divRel, divProd, divTaxas].forEach(d => d.classList.add('hidden'));

    if(aba === 'relatorios') {
        btnRel.className = "flex-1 py-2 rounded-lg font-bold bg-slate-800 text-white transition";
        divRel.classList.remove('hidden');
        carregarRelatorios();
    } else if(aba === 'produtos') {
        btnProd.className = "flex-1 py-2 rounded-lg font-bold bg-slate-800 text-white transition";
        divProd.classList.remove('hidden');
        carregarCrudProdutos();
    } else {
        btnTaxas.className = "flex-1 py-2 rounded-lg font-bold bg-slate-800 text-white transition";
        divTaxas.classList.remove('hidden');
        carregarCrudTaxas();
    }
}

function carregarRelatorios() {
    const agora = new Date();
    let hoje = 0, semana = 0, mes = 0;
    const listaHist = document.getElementById('lista-historico-vendas');
    if (!listaHist) return;
    listaHist.innerHTML = '';

    [...historicoVendas].reverse().forEach(v => {
        const d = new Date(v.data);
        if(d.toDateString() === agora.toDateString()) hoje += v.total;
        if((agora - d)/(1000*60*60*24) <= 7) semana += v.total;
        if(d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()) mes += v.total;

        listaHist.innerHTML += `
            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between text-[11px]">
                <span class="text-slate-400">${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
                <span class="text-emerald-400 font-bold">R$ ${v.total.toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById('relatorio-hoje').innerText = `R$ ${hoje.toFixed(2)}`;
    document.getElementById('relatorio-semana').innerText = `R$ ${semana.toFixed(2)}`;
    document.getElementById('relatorio-mes').innerText = `R$ ${mes.toFixed(2)}`;
}

function registrarVendaBalcao() {
    const val = parseFloat(document.getElementById('venda-manual-valor').value);
    if(!val || val <= 0) return;

    historicoVendas.push({
        data: new Date().toISOString(),
        total: val
    });
    localStorage.setItem('historico_vendas_mimos', JSON.stringify(historicoVendas));
    document.getElementById('venda-manual-valor').value = '';
    carregarRelatorios();

    const aviso = document.getElementById('aviso-venda-ok');
    if(aviso) {
        aviso.classList.remove('hidden');
        setTimeout(() => aviso.classList.add('hidden'), 2500);
    }
}

function limparHistorico() {
    if(confirm("Deseja realmente limpar o histórico de vendas?")) {
        historicoVendas = [];
        localStorage.removeItem('historico_vendas_mimos');
        carregarRelatorios();
    }
}

function carregarCrudProdutos() {
    const lista = document.getElementById('lista-crud-produtos');
    if (!lista) return;
    lista.innerHTML = '';

    produtos.forEach(p => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span class="text-white font-bold block">${p.nome}</span>
                    <span class="text-slate-400 text-[10px]">R$ ${p.preco.toFixed(2)} | ${p.categoria}</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="editarProduto(${p.id})" class="text-blue-400 hover:text-blue-300 px-2 py-1"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="excluirProduto(${p.id})" class="text-red-400 hover:text-red-300 px-2 py-1"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function salvarProduto() {
    const idEdicao = document.getElementById('prod-edit-id').value;
    const nome = document.getElementById('prod-nome').value.trim();
    const categoria = document.getElementById('prod-categoria').value.trim();
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const imagem = document.getElementById('prod-imagem').value.trim();

    if(!nome || isNaN(preco)) return;

    if(idEdicao) {
        const p = produtos.find(item => item.id == idEdicao);
        if(p) {
            p.nome = nome;
            p.categoria = categoria || 'geral';
            p.preco = preco;
            if(imagem) p.imagem = imagem;
        }
    } else {
        const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        produtos.push({
            id: novoId,
            nome,
            categoria: categoria || 'geral',
            preco,
            imagem: imagem || "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&auto=format&fit=crop&q=60"
        });
    }

    localStorage.setItem('produtos_fav_mimos', JSON.stringify(produtos));
    limparFormProduto();
    carregarCrudProdutos();
    renderizarProdutos();

    const aviso = document.getElementById('aviso-produto-ok');
    if(aviso) {
        aviso.classList.remove('hidden');
        setTimeout(() => aviso.classList.add('hidden'), 2500);
    }
}

function editarProduto(id) {
    const p = produtos.find(item => item.id === id);
    if(!p) return;

    document.getElementById('prod-edit-id').value = p.id;
    document.getElementById('prod-nome').value = p.nome;
    document.getElementById('prod-categoria').value = p.categoria;
    document.getElementById('prod-preco').value = p.preco;
    document.getElementById('prod-imagem').value = p.imagem || '';

    document.getElementById('titulo-form-produto').innerText = "Editar Produto";
    document.getElementById('btn-cancelar-edicao').classList.remove('hidden');
}

function limparFormProduto() {
    document.getElementById('prod-edit-id').value = document.getElementById('prod-nome').value = document.getElementById('prod-categoria').value = document.getElementById('prod-preco').value = document.getElementById('prod-imagem').value = '';
    document.getElementById('prod-edit-id').value = '';
    document.getElementById('titulo-form-produto').innerText = "Adicionar Novo Produto";
    document.getElementById('btn-cancelar-edicao').classList.add('hidden');
}

function excluirProduto(id) {
    if(confirm("Deseja realmente excluir este produto?")) {
        produtos = produtos.filter(p => p.id !== id);
        localStorage.setItem('produtos_fav_mimos', JSON.stringify(produtos));
        carregarCrudProdutos();
        renderizarProdutos();
    }
}

function carregarCrudTaxas() {
    const lista = document.getElementById('lista-crud-taxas');
    if (!lista) return;
    lista.innerHTML = '';

    bairrosTaxas.forEach(b => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span class="text-white font-bold block">${b.nome}</span>
                    <span class="text-emerald-400 font-bold text-[10px]">Taxa: R$ ${b.taxa.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onclick="excluirTaxaBairro(${b.id})" class="text-red-400 hover:text-red-300 px-2 py-1"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
}

function salvarTaxaBairro() {
    const nome = document.getElementById('taxa-bairro-nome').value.trim();
    const taxa = parseFloat(document.getElementById('taxa-bairro-valor').value);

    if(!nome || isNaN(taxa)) return;

    const novoId = bairrosTaxas.length > 0 ? Math.max(...bairrosTaxas.map(b => b.id)) + 1 : 1;
    bairrosTaxas.push({ id: novoId, nome, taxa });

    localStorage.setItem('bairros_taxas_fav_mimos', JSON.stringify(bairrosTaxas));
    
    document.getElementById('taxa-bairro-nome').value = '';
    document.getElementById('taxa-bairro-valor').value = '';
    
    carregarCrudTaxas();
    carregarSelectBairros();
    atualizarCarrinho();

    const aviso = document.getElementById('aviso-taxa-ok');
    if(aviso) {
        aviso.classList.remove('hidden');
        setTimeout(() => aviso.classList.add('hidden'), 2500);
    }
}

function excluirTaxaBairro(id) {
    if(confirm("Deseja excluir esta taxa de bairro?")) {
        bairrosTaxas = bairrosTaxas.filter(b => b.id !== id);
        localStorage.setItem('bairros_taxas_fav_mimos', JSON.stringify(bairrosTaxas));
        carregarCrudTaxas();
        carregarSelectBairros();
        atualizarCarrinho();
    }
}
