const { Op } = require("sequelize");
const Coleta = require("./models/Coleta");

const ORDENACOES = { id: "id", data: "createdAt" };

function paraObjeto(registro) {
  return registro ? registro.toJSON() : null;
}

async function inserir(dados) {
  return paraObjeto(await Coleta.create(dados));
}

async function listar(ordenarPor = "id") {
  const campo = ORDENACOES[ordenarPor] || ORDENACOES.id;
  const registros = await Coleta.findAll({ order: [[campo, "ASC"]] });
  return registros.map(paraObjeto);
}

async function buscarPorId(id) {
  return paraObjeto(await Coleta.findByPk(id));
}

async function buscarPorStatus(status) {
  const registros = await Coleta.findAll({
    where: { status: { [Op.like]: status } },
    order: [["id", "ASC"]],
  });
  return registros.map(paraObjeto);
}

async function buscarPorPrioridade(prioridade) {
  const registros = await Coleta.findAll({
    where: { prioridade: { [Op.like]: prioridade } },
    order: [["id", "ASC"]],
  });
  return registros.map(paraObjeto);
}

async function buscarPorCliente(nome) {
  const registros = await Coleta.findAll({
    where: { cliente: { [Op.like]: `%${nome}%` } },
    order: [["id", "ASC"]],
  });
  return registros.map(paraObjeto);
}

async function atualizarStatus(id, status) {
  const [afetadas] = await Coleta.update({ status }, { where: { id } });
  return afetadas > 0;
}

async function remover(id) {
  const removidas = await Coleta.destroy({ where: { id } });
  return removidas > 0;
}

module.exports = {
  inserir,
  listar,
  buscarPorId,
  buscarPorStatus,
  buscarPorPrioridade,
  buscarPorCliente,
  atualizarStatus,
  remover,
};
