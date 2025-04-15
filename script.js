document.addEventListener("DOMContentLoaded", function () {
  carregarCards();
  carregarAvisos();
  carregarMembros();
  carregarQuadros();
});

function salvarCards() {
  var cards = document.querySelectorAll(".container .card");
  var dados = [];

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var titulo = card.querySelector("h3").innerText;
    var tarefas = [];
    var spans = card.querySelectorAll(".subcards span");
    for (var j = 0; j < spans.length; j++) {
      tarefas.push(spans[j].innerText);
    }
    dados.push({ titulo: titulo, tarefas: tarefas });
  }
  localStorage.setItem("kanbanCards", JSON.stringify(dados));
}

function carregarCards() {
  var container = document.getElementById("container");
  container.innerHTML = "";
  var dados = JSON.parse(localStorage.getItem("kanbanCards")) || [];

  for (var i = 0; i < dados.length; i++) {
    var card = criarCard(dados[i].titulo);
    var subcards = card.querySelector(".subcards");
    for (var j = 0; j < dados[i].tarefas.length; j++) {
      var tarefa = criarTarefa(dados[i].tarefas[j]);
      subcards.appendChild(tarefa);
    }
    container.appendChild(card);
  }
}

function criarCard(titulo) {
  var card = document.createElement("div");
  card.className = "card";
  card.innerHTML =
    '<div class="menu">' +
    '<span class="dots" onclick="toggleMenu(this)">⋮</span>' +
    '<div class="menu-options">' +
    '<button onclick="excluirCard(this)">Excluir</button>' +
    '</div></div>' +
    '<div class="card-header"><h3 contenteditable="true" oninput="salvarCards()">' +
    (titulo || "Novo Cartão") +
    '</h3></div>' +
    '<div class="subcards"></div>' +
    '<button class="add-subcard-btn" onclick="adicionarTarefa(this)">+ Adicionar Tarefa</button>';

  return card;
}

function criarTarefa(texto) {
  var p = document.createElement("p");
  p.innerHTML =
    '<span contenteditable="true" oninput="salvarCards()">' +
    (texto || "Nova Tarefa") +
    '</span><button onclick="this.parentElement.remove(); salvarCards()">✖</button>';
  return p;
}

function adicionarTarefa(botao) {
  var container = botao.previousElementSibling;
  var novaTarefa = criarTarefa();
  container.appendChild(novaTarefa);
  salvarCards();
}

function toggleMenu(el) {
  var menu = el.nextElementSibling;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function excluirCard(botao) {
  botao.closest(".card").remove();
  salvarCards();
}


function carregarAvisos() {
  var avisos = localStorage.getItem("avisos") || "";
  document.querySelector(".box-avisos").innerText = avisos;
  document.querySelector(".box-avisos").oninput = function () {
    localStorage.setItem("avisos", this.innerText);
  };
}

function carregarMembros() {
  var lista = document.getElementById("listaMembros");
  var membros = JSON.parse(localStorage.getItem("membros")) || ["👤 usuario 1", "👤 usuario 2"];
  for (var i = 0; i < membros.length; i++) {
    var div = document.createElement("div");
    div.className = "membro";
    div.innerHTML =
      '<span>' + membros[i] + '</span>' +
      '<span class="dots" onclick="abrirMenuMembro(this)">⋮</span>' +
      '<div class="menu-options">' +
      '<button onclick="renomearMembro(' + i + ')">Renomear</button>' +
      '<button onclick="excluirMembro(' + i + ')">Excluir</button>' +
      '</div>';
    lista.insertBefore(div, lista.querySelector(".convidar-membro"));
  }
}

function abrirMenuMembro(el) {
  var menu = el.nextElementSibling;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function renomearMembro(i) {
  var nome = prompt("Novo nome:");
  if (nome) {
    var membros = JSON.parse(localStorage.getItem("membros"));
    membros[i] = nome;
    localStorage.setItem("membros", JSON.stringify(membros));
    location.reload();
  }
}

function excluirMembro(i) {
  var membros = JSON.parse(localStorage.getItem("membros"));
  membros.splice(i, 1);
  localStorage.setItem("membros", JSON.stringify(membros));
  location.reload();
}

function convidarMembro() {
  var lista = document.getElementById("listaMembros");
  var membros = JSON.parse(localStorage.getItem("membros")) || [];

  var div = document.createElement("div");
  div.className = "membro";

  var span = document.createElement("span");
  span.contentEditable = true;
  span.innerText = "Novo membro";
  span.onblur = function () {
    var nome = span.innerText.trim();
    if (nome !== "") {
      membros.push(nome);
      localStorage.setItem("membros", JSON.stringify(membros));
    }
  };

  div.appendChild(span);
  lista.insertBefore(div, lista.querySelector(".convidar-membro"));
  span.focus();
}

function carregarQuadros() {
  var area = document.getElementById("quadroArea");
  area.innerHTML = "";
  var quadros = JSON.parse(localStorage.getItem("quadros")) || ["Quadro 1"];
  for (var i = 0; i < quadros.length; i++) {
    var div = document.createElement("div");
    div.className = "quadro-bloco";
    div.innerHTML =
      '<span contenteditable="true" oninput="editarQuadro(this, ' + i + ')">' + quadros[i] + '</span>' +
      '<button onclick="excluirQuadro(' + i + ')">✖</button>';
    area.appendChild(div);
  }
  var botao = document.createElement("button");
  botao.className = "criar-quadro";
  botao.innerText = "+ Criar novo quadro";
  botao.onclick = criarQuadro;
  area.appendChild(botao);
}

function editarQuadro(el, i) {
  var quadros = JSON.parse(localStorage.getItem("quadros"));
  quadros[i] = el.innerText;
  localStorage.setItem("quadros", JSON.stringify(quadros));
}

function excluirQuadro(i) {
  var quadros = JSON.parse(localStorage.getItem("quadros"));
  quadros.splice(i, 1);
  localStorage.setItem("quadros", JSON.stringify(quadros));
  carregarQuadros();
}

function criarQuadro() {
  var quadros = JSON.parse(localStorage.getItem("quadros")) || [];
  quadros.push("Novo Quadro");
  localStorage.setItem("quadros", JSON.stringify(quadros));
  carregarQuadros();
}
