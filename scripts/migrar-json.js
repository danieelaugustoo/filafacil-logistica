// Uso único: importa as coletas do antigo colects.json para o banco SQLite.
const fs = require("fs");
const path = require("path");
const sequelize = require("../database");
const Coleta = require("../models/Coleta");

const ARQUIVO = path.join(__dirname, "..", "colects.json");

async function migrar() {
  if (!fs.existsSync(ARQUIVO)) {
    console.log("colects.json não encontrado. Nada a migrar.");
    return;
  }

  const antigas = JSON.parse(fs.readFileSync(ARQUIVO, "utf-8"));
  await sequelize.sync();

  if ((await Coleta.count()) > 0) {
    console.log("O banco já possui coletas. Migração cancelada para evitar duplicidade.");
    return;
  }

  await Coleta.bulkCreate(
    antigas.map((c) => ({
      id: c.id,
      cliente: c.cliente,
      endereco: c.endereco,
      pacotes: Number(c.pacotes),
      prioridade: String(c.prioridade).toLowerCase(),
      status: c.status,
    })),
    { validate: true },
  );

  console.log(`${antigas.length} coleta(s) migrada(s) para o banco.`);
}

migrar()
  .catch((erro) => {
    console.error("Erro na migração:", erro.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
