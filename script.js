const CHAVE_STORAGE = "sistema_tarefas";
let listaDeTarefas = [];
let filtroAtual = 'todas';

class Tarefa {
    #concluida;
    constructor(texto){
        if (!texto || texto.trim()===""){
            throw new Error("O texto não pode estar Vazio.");
        }

        this.texto = texto.trim();
        this.#concluida = false;
    }

    get concluida(){
        return this.#concluida;
    }

    alternarStatus(){
        this.#concluida = !this.#concluida;
    }
}


const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefasDOM = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const iconeTema = botaoAlternarTema.querySelector('i');

function atualizarContador(){
    const total = listaDeTarefas.length;
    if (total === 1){
        contadorTarefas.textContent = "1 tarefa na lista";
    }else{
        contadorTarefas.textContent = `${total} tarefas na lista`;
    }
}


function renderizarLista(){
    listaTarefasDOM.innerHTML = "";
    
   
    const tarefasFiltradas = listaDeTarefas.filter((tarefa) => {
        if (filtroAtual === 'pendentes') return !tarefa.concluida;
        if (filtroAtual === 'concluidas') return tarefa.concluida;
        return true; 
    });

    tarefasFiltradas.forEach((tarefa) => {
        const indexReal = listaDeTarefas.indexOf(tarefa);
        
        const li = document.createElement('li');
        li.classList.add('item-tarefa');

        if (tarefa.concluida){
            li.classList.add('concluido');
        }

        li.innerHTML = `<span>${tarefa.texto}</span>
            <div class="acoes-tarefa">
                <button class="botao-acao" onclick="alternarStatusTarefa(${indexReal})">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="botao-acao excluir" onclick="removerTarefa(${indexReal})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>`;

        listaTarefasDOM.appendChild(li);
    });

    atualizarContador();
}

function filtrarTarefas(tipo, elementoBotao) {
    filtroAtual = tipo;

   
    const botoes = document.querySelectorAll('.filtros-tarefas button');
    botoes.forEach(botao => botao.classList.remove('ativo'));
    
    if (elementoBotao) {
        elementoBotao.classList.add('ativo');
    }

    renderizarLista();
}

function alternarStatusTarefa(index){
    listaDeTarefas[index].alternarStatus();
    salvarNoLocalStorage();
    renderizarLista();
}

function removerTarefa(index){
    listaDeTarefas.splice(index, 1);
    salvarNoLocalStorage();
    renderizarLista();
}

function salvarNoLocalStorage() {
    const listaEmTexto = JSON.stringify(listaDeTarefas);
    localStorage.setItem(CHAVE_STORAGE, listaEmTexto);
}

function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        const produtosObjetos = JSON.parse(dadosSalvos);
        
        produtosObjetos.forEach((prod) => {

            const tarefaInstanciada = new Tarefa(prod.texto);
            if (prod.concluida) {
                tarefaInstanciada.alternarStatus();
            }
            listaDeTarefas.push(tarefaInstanciada);
        });
    }
}


carregarDoLocalStorage();
renderizarLista();

botaoAdicionar.addEventListener('click', () => {
    const textoDigitado = campoTarefa.value;

    try {
        const novaTarefa = new Tarefa(textoDigitado);
        listaDeTarefas.push(novaTarefa);

        salvarNoLocalStorage();
        renderizarLista();

        campoTarefa.value = "";
    } catch (error) {
        alert(error.message);
    }
});

campoTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        botaoAdicionar.click();
    }
});

const temaSalvo = localStorage.getItem('tema_preferido');
if (temaSalvo === 'escuro') {
    document.body.classList.add('modo-escuro');
    iconeTema.classList.replace('fa-moon', 'fa-sun');
}

botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');

    if (document.body.classList.contains('modo-escuro')) {
        iconeTema.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('tema_preferido', 'escuro');
    } else {
        iconeTema.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('tema_preferido', 'claro');
    }
});

 
const botaoLimparConcluidas = document.getElementById('botao-limpar-concluidas');

if (botaoLimparConcluidas) {
    botaoLimparConcluidas.addEventListener('click', () => {
        for (let i = listaDeTarefas.length - 1; i >= 0; i--) {
            if (listaDeTarefas[i].concluida) {
                listaDeTarefas.splice(i, 1);
            }
        }

        salvarNoLocalStorage();
        renderizarLista();
    });
}