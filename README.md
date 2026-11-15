# FilaFácil Logística

Aplicação de terminal em Node.js para controlar coletas de uma operação de logística: cadastrar, listar por prioridade, atualizar o status e ver um resumo operacional.

Projeto pequeno de estudo, sem dependências externas. O objetivo foi praticar separação de responsabilidades e persistência em arquivo usando só a biblioteca padrão do Node.

## Funcionalidades

- Cadastro de coleta com cliente, endereço, quantidade de pacotes e prioridade
- Listagem de todas as coletas ou filtrada por prioridade
- Atualização de status pelo ID
- Resumo com total de coletas, total de pacotes e contagem por status e por prioridade
- Dados gravados em `colects.json`, então nada se perde ao fechar o programa

## Como rodar

Precisa do Node.js 18 ou mais recente. Não há pacotes para instalar.

```bash
git clone https://github.com/danieelaugustoo/filafacil-logistica.git
cd filafacil-logistica
node index.js
```

```text
[ FILAFÁCIL LOGÍSTICA ]
1. Nova coleta
2. Listar / Filtrar
3. Mudar status
4. Resumo
5. Sair

Opção:
```

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `index.js` | Menu e interação com o usuário via `readline/promises` |
| `colects.js` | Regras de negócio: validação, filtro, mudança de status e resumo |
| `repository.js` | Leitura e gravação do arquivo JSON |
| `colects.json` | Dados das coletas |

O menu só conversa com `colects.js`, que por sua vez é o único que chama o repositório. Trocar o JSON por um banco de dados mexeria apenas em `repository.js`.

## Próximos passos

- Validar a prioridade e o status contra uma lista fixa de valores
- Gerar IDs que não se repitam caso uma coleta seja removida
- Adicionar testes para as regras de `colects.js`
- Migrar a persistência para SQLite
