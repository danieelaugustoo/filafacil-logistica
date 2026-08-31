const fs = require("fs");

function salvar(dados) {
  fs.writeFileSync("colects.json", JSON.stringify(dados, null, 2));
}

function carregar() {
  try {
    const file = fs.readFileSync("colects.json", "utf-8");
    return JSON.parse(file);
  } catch (error) {
    return [];
  }
}

module.exports = { salvar, carregar };
