const service = require("./service");

function nova({ cliente, endereco, pacotes, prioridade }) {
  return service.cadastrar({
    cliente,
    endereco,
    pacotes: Number(pacotes),
    prioridade,
  });
}

function listar(ordem) {
  return service.listar(ordem === "2" ? "data" : "id");
}

function filtrar(opcao, valor) {
  const tipos = { 1: "status", 2: "prioridade", 3: "cliente" };
  return service.filtrar(tipos[opcao], valor);
}

function atualizarStatus(id, status) {
  return service.atualizarStatus(Number(id), status);
}

function deletar(id) {
  return service.deletar(Number(id));
}

function resumo() {
  return service.resumo();
}

module.exports = { nova, listar, filtrar, atualizarStatus, deletar, resumo };
