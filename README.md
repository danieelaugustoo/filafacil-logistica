# FilaFácil Logística

Aplicação de terminal para gerenciar coletas de uma operação logística. A persistência, antes feita em um arquivo JSON, agora usa um banco relacional local (**SQLite**) acessado por um ORM (**Sequelize**).

## Requisitos

- Node.js 18 ou superior
- npm

Nenhum servidor de banco é necessário: o SQLite grava tudo no arquivo local `database.sqlite`.

## Configuração do banco

```bash
npm install
```

Só isso. Na primeira execução, o app cria o arquivo `database.sqlite` e a tabela `coletas` automaticamente (`sequelize.sync()`).

### Tabela `coletas`

| coluna       | tipo                        | regra                                   |
| ------------ | --------------------------- | --------------------------------------- |
| `id`         | INTEGER, chave primária     | autoincremento                          |
| `cliente`    | VARCHAR(255), obrigatório   | não pode ser vazio                      |
| `endereco`   | VARCHAR(255), obrigatório   | não pode ser vazio                      |
| `pacotes`    | INTEGER, obrigatório        | inteiro maior que 0                     |
| `prioridade` | VARCHAR(255), obrigatório   | `baixa`, `media` ou `alta`              |
| `status`     | VARCHAR(255), obrigatório   | padrão `pendente`                       |
| `createdAt`  | DATETIME                    | data de criação, preenchida automaticamente |

## Como executar

```bash
npm start
```

Menu interativo (em loop até escolher **Sair**):

1. **Nova coleta**: cadastra com validação de campos obrigatórios.
2. **Listar coletas**: ordena por ID ou por data de criação.
3. **Filtrar coletas**: por status, prioridade ou nome do cliente (busca parcial, sem diferenciar maiúsculas).
4. **Mudar status**: atualiza pelo ID (confirma que a coleta existe).
5. **Deletar coleta**: remove pelo ID (confirma que a coleta existe).
6. **Resumo**: totais de coletas e pacotes, por status e por prioridade.
7. **Sair**.

Os dados persistem entre execuções. Para começar do zero, apague o arquivo `database.sqlite`.

## Migração dos dados antigos (opcional)

Se você tiver um `colects.json` do formato antigo na raiz do projeto, importe-o uma única vez:

```bash
npm run migrar
```

O script recusa rodar se o banco já tiver coletas, para evitar duplicidade.

## Arquitetura

```
index.js              menu interativo (entrada/saída no terminal)
controller.js         converte a entrada do menu e delega ao service
service.js            validações e regras de negócio (sem ORM)
repository.js         único ponto de acesso ao banco, via Sequelize
models/Coleta.js      mapeamento da tabela `coletas`
database.js           conexão Sequelize/SQLite
scripts/migrar-json.js importação única do JSON antigo
```

Toda a lógica de banco (insert, select com `WHERE`, update e delete) fica no `repository.js`; controller e service não acessam o banco diretamente.
