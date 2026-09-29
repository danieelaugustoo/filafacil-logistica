const repo = require("./repository");

const PRIORIDADES = ["baixa", "media", "alta"];

function iniciar() {
  return repo.iniciar();
}

function encerrar() {
  return repo.encerrar();
}

function vazio(valor) {
  return valor === undefined || valor === null || String(valor).trim() === "";
}

function resultado(ok, mensagem, dados) {
  return { ok, mensagem, dados };
}

async function cadastrar({ cliente, endereco, pacotes, prioridade }) {
  if (vazio(cliente) || vazio(endereco) || vazio(prioridade)) {
    return resultado(false, "Cliente, endereço e prioridade são obrigatórios.");
  }
  if (!Number.isInteger(pacotes) || pacotes <= 0) {
    return resultado(
      false,
      "Quantidade de pacotes deve ser um inteiro maior que 0.",
    );
  }

  const prio = String(prioridade).trim().toLowerCase();
  if (!PRIORIDADES.includes(prio)) {
    return resultado(
      false,
      `Prioridade inválida. Use: ${PRIORIDADES.join(", ")}.`,
    );
  }

  const coleta = await repo.inserir({
    cliente: String(cliente).trim(),
    endereco: String(endereco).trim(),
    pacotes,
    prioridade: prio,
    status: "pendente",
  });
  return resultado(true, "Coleta salva com sucesso!", coleta);
}

async function listar(ordenarPor) {
  return resultado(true, "", await repo.listar(ordenarPor));
}

async function filtrar(tipo, valor) {
  if (vazio(valor)) {
    return resultado(false, "Informe um valor para o filtro.");
  }

  const buscas = {
    status: repo.buscarPorStatus,
    prioridade: repo.buscarPorPrioridade,
    cliente: repo.buscarPorCliente,
  };
  const buscar = buscas[tipo];
  if (!buscar) {
    return resultado(false, "Tipo de filtro inválido.");
  }

  return resultado(true, "", await buscar(String(valor).trim()));
}

async function atualizarStatus(id, status) {
  if (!Number.isInteger(id) || id <= 0) {
    return resultado(false, "ID inválido.");
  }
  if (vazio(status)) {
    return resultado(false, "O novo status é obrigatório.");
  }
  if (!(await repo.buscarPorId(id))) {
    return resultado(false, "Erro: ID não existe.");
  }

  await repo.atualizarStatus(id, String(status).trim());
  return resultado(true, "Status alterado!");
}

async function deletar(id) {
  if (!Number.isInteger(id) || id <= 0) {
    return resultado(false, "ID inválido.");
  }
  if (!(await repo.buscarPorId(id))) {
    return resultado(false, "Erro: ID não existe.");
  }

  await repo.remover(id);
  return resultado(true, "Coleta removida!");
}

async function resumo() {
  const coletas = await repo.listar();

  const porStatus = {};
  const porPrioridade = {};
  coletas.forEach((c) => {
    porStatus[c.status] = (porStatus[c.status] || 0) + 1;
    porPrioridade[c.prioridade] = (porPrioridade[c.prioridade] || 0) + 1;
  });

  return resultado(true, "", {
    totalColetas: coletas.length,
    totalPacotes: coletas.reduce((acc, c) => acc + c.pacotes, 0),
    porStatus,
    porPrioridade,
  });
}

module.exports = {
  iniciar,
  encerrar,
  cadastrar,
  listar,
  filtrar,
  atualizarStatus,
  deletar,
  resumo,
};
