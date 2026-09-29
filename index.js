const readline = require("readline/promises");
const api = require("./colects");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  while (true) {
    console.log("\n[ FILAFÁCIL LOGÍSTICA ]");
    console.log("1. Nova coleta");
    console.log("2. Listar / Filtrar");
    console.log("3. Mudar status");
    console.log("4. Resumo");
    console.log("5. Sair");

    const op = await rl.question("\nOpção: ");

    switch (op) {
      case "1":
        console.log("\n-- Nova Coleta --");
        const cliente = await rl.question("Cliente: ");
        const endereco = await rl.question("Endereço: ");
        const pacotes = await rl.question("Qtd pacotes: ");
        const prioridade = await rl.question(
          "Prioridade (baixa, media, alta): ",
        );

        if (api.cadastrar(cliente, endereco, Number(pacotes), prioridade)) {
          console.log("Coleta salva com sucesso!");
        } else {
          console.log("Erro: preencha tudo corretamente e pacotes > 0.");
        }
        break;

      case "2":
        const filtro = await rl.question(
          "\nFiltrar por prioridade (deixe em branco p/ listar todas): ",
        );
        const lista = api.listar(filtro);

        if (lista.length === 0) {
          console.log("Nenhuma coleta encontrada.");
          break;
        }

        lista.forEach((c) => {
          console.log(
            `\n[ID: ${c.id}] ${c.cliente} | Status: ${c.status} | Prio: ${c.prioridade}`,
          );
          console.log(`Endereço: ${c.endereco} | Pacotes: ${c.pacotes}`);
        });
        break;

      case "3":
        console.log("\n-- Atualizar Status --");
        const id = await rl.question("ID da coleta: ");
        const status = await rl.question("Novo status: ");

        if (api.atualizarStatus(id, status)) {
          console.log("Status alterado!");
        } else {
          console.log("Erro: ID não existe.");
        }
        break;

      case "4":
        console.log("\n-- Resumo Operacional --");
        const r = api.resumo();
        console.log(`Total de Coletas: ${r.totalColetas}`);
        console.log(`Total de Pacotes: ${r.totalPacotes}`);

        console.log("\nPor Status:");
        if (Object.keys(r.porStatus).length === 0) {
          console.log("Nenhum dado registrado.");
        } else {
          Object.entries(r.porStatus).forEach(([st, qtd]) =>
            console.log(`- ${st}: ${qtd}`),
          );
        }

        console.log("\nPor Prioridade:");
        if (Object.keys(r.porPrioridade).length === 0) {
          console.log("Nenhum dado registrado.");
        } else {
          Object.entries(r.porPrioridade).forEach(([pr, qtd]) =>
            console.log(`- ${pr}: ${qtd}`),
          );
        }
        break;

      case "5":
        console.log("Encerrando...");
        rl.close();
        return;

      default:
        console.log("Opção inválida.");
    }
  }
}

init();
