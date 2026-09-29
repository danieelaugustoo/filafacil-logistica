const readline = require("readline/promises");
const sequelize = require("./database");
const controller = require("./controller");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function imprimirColetas(coletas) {
  if (coletas.length === 0) {
    console.log("Nenhuma coleta encontrada.");
    return;
  }

  coletas.forEach((c) => {
    console.log(
      `\n[ID: ${c.id}] ${c.cliente} | Status: ${c.status} | Prio: ${c.prioridade}`,
    );
    console.log(
      `Endereço: ${c.endereco} | Pacotes: ${c.pacotes} | Criada em: ${new Date(c.createdAt).toLocaleString("pt-BR")}`,
    );
  });
}

function imprimirContagem(titulo, contagem) {
  console.log(`\n${titulo}:`);
  const entradas = Object.entries(contagem);
  if (entradas.length === 0) {
    console.log("Nenhum dado registrado.");
    return;
  }
  entradas.forEach(([chave, qtd]) => console.log(`- ${chave}: ${qtd}`));
}

async function init() {
  await sequelize.sync();

  while (true) {
    console.log("\n[ FILAFÁCIL LOGÍSTICA ]");
    console.log("1. Nova coleta");
    console.log("2. Listar coletas");
    console.log("3. Filtrar coletas");
    console.log("4. Mudar status");
    console.log("5. Deletar coleta");
    console.log("6. Resumo");
    console.log("7. Sair");

    const op = await rl.question("\nOpção: ");
    let r;

    switch (op) {
      case "1": {
        console.log("\n-- Nova Coleta --");
        const cliente = await rl.question("Cliente: ");
        const endereco = await rl.question("Endereço: ");
        const pacotes = await rl.question("Qtd pacotes: ");
        const prioridade = await rl.question(
          "Prioridade (baixa, media, alta): ",
        );

        r = await controller.nova({ cliente, endereco, pacotes, prioridade });
        console.log(r.mensagem);
        break;
      }

      case "2": {
        const ordem = await rl.question("\nOrdenar por (1) ID ou (2) data: ");
        r = await controller.listar(ordem);
        imprimirColetas(r.dados);
        break;
      }

      case "3": {
        const tipo = await rl.question(
          "\nFiltrar por (1) status, (2) prioridade ou (3) nome do cliente: ",
        );
        if (!["1", "2", "3"].includes(tipo)) {
          console.log("Opção de filtro inválida.");
          break;
        }
        const valor = await rl.question("Valor: ");
        r = await controller.filtrar(tipo, valor);
        if (r.ok) imprimirColetas(r.dados);
        else console.log(r.mensagem);
        break;
      }

      case "4": {
        console.log("\n-- Atualizar Status --");
        const id = await rl.question("ID da coleta: ");
        const status = await rl.question("Novo status: ");
        r = await controller.atualizarStatus(id, status);
        console.log(r.mensagem);
        break;
      }

      case "5": {
        console.log("\n-- Deletar Coleta --");
        const id = await rl.question("ID da coleta: ");
        r = await controller.deletar(id);
        console.log(r.mensagem);
        break;
      }

      case "6": {
        console.log("\n-- Resumo Operacional --");
        r = await controller.resumo();
        console.log(`Total de Coletas: ${r.dados.totalColetas}`);
        console.log(`Total de Pacotes: ${r.dados.totalPacotes}`);
        imprimirContagem("Por Status", r.dados.porStatus);
        imprimirContagem("Por Prioridade", r.dados.porPrioridade);
        break;
      }

      case "7":
        console.log("Encerrando...");
        rl.close();
        await sequelize.close();
        return;

      default:
        console.log("Opção inválida.");
    }
  }
}

init().catch((erro) => {
  console.error("Erro inesperado:", erro.message);
  rl.close();
  sequelize.close();
  process.exit(1);
});
