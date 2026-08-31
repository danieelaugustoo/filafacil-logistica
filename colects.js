const repo = require("./repository");
const coletas = repo.carregar();

function cadastrar(cliente, endereco, pacotes, prioridade) {
  if (!cliente || !endereco || pacotes <= 0 || !prioridade) return false;

  coletas.push({
    id: coletas.length + 1,
    cliente,
    endereco,
    pacotes,
    prioridade,
    status: "pendente",
  });

  repo.salvar(coletas);
  return true;
}

function listar(prio) {
  if (!prio) return coletas;
  return coletas.filter(
    (c) => c.prioridade.toLowerCase() === prio.toLowerCase(),
  );
}

function atualizarStatus(id, status) {
  const coleta = coletas.find((c) => c.id == id);
  if (!coleta) return false;

  coleta.status = status;
  repo.salvar(coletas);
  return true;
}

function resumo() {
  const totalColetas = coletas.length;
  const totalPacotes = coletas.reduce((acc, c) => acc + Number(c.pacotes), 0);

  const porStatus = {};
  const porPrioridade = {};

  coletas.forEach((c) => {
    porStatus[c.status] = (porStatus[c.status] || 0) + 1;
    porPrioridade[c.prioridade] = (porPrioridade[c.prioridade] || 0) + 1;
  });

  return { totalColetas, totalPacotes, porStatus, porPrioridade };
}

module.exports = { cadastrar, listar, atualizarStatus, resumo };
