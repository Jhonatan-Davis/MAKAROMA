let carrinho = [];

function abrirSacola() {
    document.getElementById('modal-sacola').style.display = 'flex';
}

function fecharSacola() {
    document.getElementById('modal-sacola').style.display = 'none';
}

function adicionarAoCarrinho(nome, preco, detalhes = "") {
    let itemExistente = carrinho.find(item => item.nome === nome && item.detalhes === detalhes);
    
    if (itemExistente) {
        itemExistente.quantidade++; 
    } else {
        carrinho.push({ 
            nome: nome, 
            preco: preco, 
            quantidade: 1, 
            detalhes: detalhes 
        }); 
    }
    
    atualizarSacola();
    document.getElementById('btn-sacola').style.display = 'block';
}

function atualizarSacola() {
    let lista = document.getElementById('lista-itens-sacola');
    let totalSpan = document.getElementById('valor-total-sacola');
    let contador = document.getElementById('contador-sacola');

    lista.innerHTML = '';
    let valorTotal = 0;
    let totalItens = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#666; margin: 20px 0;">Sua sacola está vazia 🥺</p>';
        document.getElementById('btn-sacola').style.display = 'none'; 
        totalSpan.innerText = '0,00';
        if(contador) contador.innerText = '0';
        return; 
    }

    carrinho.forEach((item, index) => {
        let subtotal = item.preco * item.quantidade;
        valorTotal += subtotal;
        totalItens += item.quantidade;

        let detalhesHTML = item.detalhes ? `<small style="display:block; color:#666; font-style:italic; font-size:0.85em; margin-top:2px;">${item.detalhes}</small>` : '';

        lista.innerHTML += `
            <div class="item-carrinho">
                <div class="item-info">
                    <strong>${item.nome}</strong>
                    ${detalhesHTML}
                    <span class="item-preco">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="item-controles">
                    <div class="controle-quantidade">
                        <button onclick="alterarQuantidade(${index}, -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                    <button class="btn-remover" onclick="removerItem(${index})" title="Remover item">🗑️</button>
                </div>
            </div>
        `;
    });

    // Mantém os campos de entrega que você criou
    lista.innerHTML += `
        <div class="dados-cliente" style="margin-top: 25px; border-top: 2px solid #eee; padding-top: 15px;">
            <h3 style="font-size: 16px; margin-bottom: 10px; color: #333;">📍 Dados da Entrega</h3>
            <input type="text" id="nome-cliente" placeholder="Seu Nome Completo" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 8px;">
            <input type="text" id="endereco-cliente" placeholder="Rua, Número, Bairro, Ponto de Ref." required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 8px;">
            
            <textarea id="observacoes-pedido" placeholder="Alguma observação? (Ex: tirar cebola, levar troco para R$ 50, etc)" 
                style="width: 100%; height: 60px; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 8px; resize: none; font-family: inherit;"></textarea>

            <select id="forma-pagamento" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
                <option value="Pix">Pix (Levar a maquineta/QR Code)</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
            </select>
        </div>
    `;

    totalSpan.innerText = valorTotal.toFixed(2).replace('.', ',');
    if(contador) contador.innerText = totalItens;
}

function alterarQuantidade(index, mudanca) {
    carrinho[index].quantidade += mudanca;
    
    if (carrinho[index].quantidade <= 0) {
        removerItem(index);
    } else {
        atualizarSacola();
    }
}

function removerItem(index) {
    carrinho.splice(index, 1); 
    atualizarSacola();
    
    if (carrinho.length === 0) {
        fecharSacola(); 
    }
}

// SUA FUNÇÃO ORIGINAL RESTAURADA E FUNCIONANDO
function mostrarIngredientes(selectElement) {
    let container = selectElement.parentElement.parentElement.querySelector('.container-acompanhamentos');
    if (container) {
        if (selectElement.value !== 'escolha') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }
}

function adicionarMassaAoCarrinho(btnElement, nomeMassa, precoBase) {
    let cardOpcoes = btnElement.parentElement.parentElement;
    let selectMolho = cardOpcoes.querySelector('.select-molho');
    
    if (!selectMolho || selectMolho.value === 'escolha') {
        alert('Por favor, escolha um molho antes de adicionar a massa!');
        return;
    }

    let molho = selectMolho.value;
    let checkboxes = cardOpcoes.querySelectorAll('input[type="checkbox"]:checked');
    let acompanhamentos = [];
    
    checkboxes.forEach(cb => acompanhamentos.push(cb.value));

    let precoExtra = 0;
    let valorPorExtra = 4.00; 
    
    if (acompanhamentos.length > 6) {
        precoExtra = (acompanhamentos.length - 6) * valorPorExtra;
    }

    let precoTotal = precoBase + precoExtra;
    
    // FORMATANDO OS DETALHES CORRETAMENTE EM VEZ DE MOSTRAR SÓ A QUANTIDADE
    let detalhesStr = `Molho: ${molho}`;
    if (acompanhamentos.length > 0) {
        detalhesStr += ` | Itens: ${acompanhamentos.join(', ')}`;
    }

    adicionarAoCarrinho(nomeMassa, precoTotal, detalhesStr);
    
    selectMolho.value = 'escolha';
    checkboxes.forEach(cb => cb.checked = false);
    mostrarIngredientes(selectMolho);
    alert(`${nomeMassa} adicionada à sacola!`);
}

function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    // CAPTURA DOS SEUS CAMPOS DE ENTREGA
    let nomeCliente = document.getElementById('nome-cliente') ? document.getElementById('nome-cliente').value.trim() : "";
    let endereco = document.getElementById('endereco-cliente') ? document.getElementById('endereco-cliente').value.trim() : "";
    let observacoes = document.getElementById('observacoes-pedido') ? document.getElementById('observacoes-pedido').value.trim() : "";
    let pagamento = document.getElementById('forma-pagamento') ? document.getElementById('forma-pagamento').value : "";

    if (!nomeCliente || !endereco) {
        alert("Por favor, preencha o seu Nome e Endereço para a entrega!");
        return;
    }

    let mensagem = `*NOVO PEDIDO - MAKAROMA*\n`;
    mensagem += `----------------------------\n\n`;
    
    carrinho.forEach(item => {
        mensagem += `✅ *${item.quantidade}x ${item.nome}*\n`;
        
        if (item.detalhes) {
            mensagem += `   _(${item.detalhes})_\n`;
        }
        
        mensagem += `   Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n\n`;
    });

    let totalGeral = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    mensagem += `----------------------------\n`;
    mensagem += `*TOTAL DA COMPRA: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n\n`;

    mensagem += `*📍 DADOS DA ENTREGA*\n`;
    mensagem += `Nome: ${nomeCliente}\n`;
    mensagem += `Endereço: ${endereco}\n`;
    mensagem += `Pagamento: ${pagamento}\n`;
    
    if (observacoes) {
        mensagem += `Observações: ${observacoes}\n`;
    }

    const fone = "5564993355510"; // Seu número mantido
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// ==========================================
// LÓGICA DAS PIZZAS (INTACTA)
// ==========================================
const checkboxesSabores = document.querySelectorAll('.checkbox-sabor');
const precoDinamicoSpan = document.getElementById('preco-dinamico-pizza');
const btnAdd2Sabores = document.getElementById('btn-add-2sabores');
let precoCalculadoPizza = 0;

if(checkboxesSabores) {
    checkboxesSabores.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selecionados = document.querySelectorAll('.checkbox-sabor:checked');

            if (selecionados.length > 2) {
                this.checked = false;
                alert("Atenção: Por favor, escolha apenas 2 metades!");
                return;
            }

            let maiorPreco = 0;
            selecionados.forEach(sabor => {
                const preco = parseFloat(sabor.getAttribute('data-preco'));
                if (preco > maiorPreco) {
                    maiorPreco = preco;
                }
            });
            
            precoCalculadoPizza = maiorPreco;

            if(selecionados.length > 0) {
                precoDinamicoSpan.textContent = "R$ " + maiorPreco.toFixed(2).replace('.', ',');
            } else {
                precoDinamicoSpan.textContent = "R$ 0,00";
            }

            if (selecionados.length === 2) {
                btnAdd2Sabores.disabled = false;
                btnAdd2Sabores.style.backgroundColor = "#ff6600";
                btnAdd2Sabores.style.cursor = "pointer";
            } else {
                btnAdd2Sabores.disabled = true;
                btnAdd2Sabores.style.backgroundColor = "#ccc";
                btnAdd2Sabores.style.cursor = "not-allowed";
            }
        });
    });
}

function adicionarPizza2Sabores() {
    const selecionados = document.querySelectorAll('.checkbox-sabor:checked');
    if (selecionados.length === 2) {
        const sabor1 = selecionados[0].value;
        const sabor2 = selecionados[1].value;
        const nomeProduto = `Pizza Meio a Meio (1/2 ${sabor1} e 1/2 ${sabor2})`;
        
        adicionarAoCarrinho(nomeProduto, precoCalculadoPizza);
        
        checkboxesSabores.forEach(cb => cb.checked = false);
        btnAdd2Sabores.disabled = true;
        btnAdd2Sabores.style.backgroundColor = "#ccc";
        btnAdd2Sabores.style.cursor = "not-allowed";
        precoDinamicoSpan.textContent = "R$ 0,00";
        
        alert("Pizza Meio a Meio adicionada à sacola!");
    }
}

function atualizarPrecoCard(selectElement) {
    const preco = parseFloat(selectElement.selectedOptions[0].getAttribute('data-preco'));
    const cardInfo = selectElement.closest('.card-info');
    const precoSpan = cardInfo.querySelector('.preco');
    precoSpan.innerText = `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function adicionarPizzaComTamanho(botao, nomeBase) {
    const cardInfo = botao.closest('.card-info');
    const seletor = cardInfo.querySelector('.select-tamanho');
    const tamanho = seletor.value;
    const preco = parseFloat(seletor.selectedOptions[0].getAttribute('data-preco'));
    
    const nomeCompleto = `${nomeBase} (${tamanho})`;
    adicionarAoCarrinho(nomeCompleto, preco);
    alert(`${nomeCompleto} adicionada à sacola!`);
}