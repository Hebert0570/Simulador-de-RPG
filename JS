// Variáveis Globais Simples para o Estado do Jogo
let heroiNome = "";
let heroiClasse = "";
let heroiHP = 100;
let monstroHP = 100;
let pocaoContador = 3;
let danoBaseHeroi = 15;
let danoBaseMonstro = 10;
let jogoAtivo = false;


// Função auxiliar para manipular o Log de Batalha (Adiciona itens à lista)
function adicionarLog(mensagem) {
    const logLista = document.getElementById('log-lista');
    // Cria um novo item (li)
    const novoItem = document.createElement('li');
    novoItem.innerText = `> ${mensagem}`;
    
    // Adiciona o novo item ao topo da lista (prepend)
    logLista.prepend(novoItem); 
}

// Função para atualizar os Status de HP e Poções na tela
function atualizarStatus() {
    // Atualiza o status do Herói
    document.getElementById('heroi-status').innerText = `HP: ${heroiHP} | Poções: ${pocaoContador}`;
    
    // Atualiza o status do Monstro
    document.getElementById('monstro-status').innerText = `HP: ${monstroHP}`;

    // Atualiza o texto do botão de cura
    document.getElementById('btn-curar').innerText = `🧪 Curar (${pocaoContador})`;

    // REQUISITO: Estrutura Condicional (Verifica o fim do jogo)
    if (heroiHP <= 0) {
        finalizarJogo(false); // Derrota
    } else if (monstroHP <= 0) {
        finalizarJogo(true); // Vitória
    }
}

// REQUISITO: Uso de Eventos (onsubmit) para Forjar o Herói
document.getElementById('form-heroi').addEventListener('submit', function(e) {
    e.preventDefault();

    heroiNome = document.getElementById('nome').value;
    heroiClasse = document.getElementById('classe').value;
    const avatarUrl = document.getElementById('avatar-url').value; 
    const fichaExibicao = document.getElementById('ficha-exibicao');

    // REQUISITO: Validação de formulário básica (verifica se campos essenciais estão vazios)
    if (heroiNome === '') {
        alert('ERRO: Digite o nome do aventureiro.');
        return;
    }
    if (heroiClasse === '') {
        alert('ERRO: Selecione uma classe.');
        return;
    }
    
    // 1. CRIAÇÃO DINÂMICA DO AVATAR (Ajuste para sua escolha de remover a tag <img> inicial)
    let heroiAvatarElement = document.getElementById('heroi-avatar');
    if (!heroiAvatarElement) {
        heroiAvatarElement = document.createElement('img');
        heroiAvatarElement.id = 'heroi-avatar';
        heroiAvatarElement.alt = 'Avatar do Herói';
        fichaExibicao.prepend(heroiAvatarElement); // Insere no topo da ficha
    }

    // 2. LÓGICA DE CLASSE E AVATAR
    if (avatarUrl.trim() !== '') {
        heroiAvatarElement.src = avatarUrl; // Usa o link do usuário
    } else {
        // Usa avatares padrão caso não haja link
        if (heroiClasse === 'guerreiro') {
            danoBaseHeroi = 25; 
            heroiAvatarElement.src = 'assets/heroi_guerreiro.png';
        } else if (heroiClasse === 'mago') {
            heroiHP = 80; // Mago começa com menos vida
            heroiAvatarElement.src = 'assets/heroi_mago.png';
        } else { // Ladino
            heroiAvatarElement.src = 'assets/heroi_ladino.png';
        }
    }

    // Manipulação do DOM: Esconde e Mostra elementos
    document.getElementById('form-heroi').style.display = 'none';
    fichaExibicao.style.display = 'block';
    document.getElementById('combate').style.display = 'block';

    // Preenche as informações na ficha
    document.getElementById('heroi-nome').innerText = heroiNome;
    document.getElementById('heroi-classe').innerText = heroiClasse.toUpperCase();
    
    jogoAtivo = true;
    adicionarLog(`O herói ${heroiNome} (${heroiClasse.toUpperCase()}) foi forjado!`);
    adicionarLog(`O Monstro K'tharr te desafia!`);
    atualizarStatus();
});


// REQUISITO: Funcionalidade Lógica Real: Ataque do Herói
function atacarMonstro() {
    if (!jogoAtivo) { return; }

    // Dano base simples.
    let dano = danoBaseHeroi; 

    // REQUISITO: Estrutura Condicional (Bônus de Crítico Ladino)
    if (heroiClasse === 'ladino' && Math.random() < 0.3) { // 30% de chance de crítico
        dano *= 2;
        adicionarLog(`💥 CRÍTICO de ${heroiNome}! Causa ${dano} de dano!`);
    }

    monstroHP = monstroHP - dano;
    if (monstroHP < 0) {
        monstroHP = 0;
    }

    adicionarLog(`${heroiNome} ataca e causa ${dano} de dano no Monstro!`);

    atualizarStatus();
    
    // O Monstro contra-ataca logo em seguida, se ainda estiver vivo
    if (monstroHP > 0 && heroiHP > 0) {
        setTimeout(ataqueMonstroSimples, 1000); 
    }
}

// REQUISITO: Funcionalidade Lógica Real: Cura do Herói
function curarHeroi() {
    if (!jogoAtivo || pocaoContador <= 0 || heroiHP <= 0 || monstroHP <= 0) {
        adicionarLog("Sem poções ou o jogo terminou!", 'log-sistema');
        return;
    }

    pocaoContador = pocaoContador - 1;
    let cura = 30;

    // REQUISITO: Estrutura Condicional (Bônus de Cura Mago)
    if (heroiClasse === 'mago') {
        cura = 40; // Mago cura mais
    }

    heroiHP = heroiHP + cura;
    if (heroiHP > 100) { 
        heroiHP = 100;
    }

    adicionarLog(`${heroiNome} usa Poção e recupera ${cura} HP!`);
    atualizarStatus();

    // Monstro ataca após a cura
    if (monstroHP > 0 && heroiHP > 0) {
        setTimeout(ataqueMonstroSimples, 1000); 
    }
}


// Ataque Simples do Monstro (Chamado em um setTimeout)
function ataqueMonstroSimples() {
    const danoMonstro = danoBaseMonstro;
    heroiHP = heroiHP - danoMonstro;

    if (heroiHP < 0) {
        heroiHP = 0;
    }

    adicionarLog(`O Monstro contra-ataca e causa ${danoMonstro} de dano em ${heroiNome}.`);
    atualizarStatus();
}

// Finaliza o jogo e desabilita botões
function finalizarJogo(vitoria) {
    jogoAtivo = false;
    
    // Desabilita botões para parar o jogo (REQUISITO: Manipulação do DOM)
    document.getElementById('btn-atacar').disabled = true;
    document.getElementById('btn-curar').disabled = true;
    
    // REQUISITO: Estrutura Condicional para Resultado Final
    if (vitoria) {
        adicionarLog(`🎉 VITÓRIA! ${heroiNome} derrotou o K'tharr!`, 'log-sistema');
    } else {
        adicionarLog(`💀 DERROTA! O K'tharr prevaleceu sobre ${heroiNome}.`, 'log-sistema');
    }
}
