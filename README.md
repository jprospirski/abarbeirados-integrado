# Abarbeirados

Sistema de gestão para barbearia — projeto acadêmico do 4º período de
Engenharia de Software / Análise e Desenvolvimento de Sistemas da **Uniamerica**.

O projeto atende a uma demanda real encaminhada à faculdade. O documento de
especificação do demandante ainda não foi formalizado, portanto as entidades e
regras de negócio seguem em aberto — o desenvolvimento avança sobre o domínio
(barbearia) e os critérios técnicos já definidos para a entrega.

---

## Status

| Frente | Situação |
|---|---|
| Backend (Spring Boot) | CRUD completo de Cliente, Serviço e Agendamento |
| Frontend (Angular) | Listagem de agendamentos e formulário de marcação, consumindo a API |
| Banco de dados | PostgreSQL 18, com dados persistentes |
| Especificação do demandante | Pendente |

---

## Entrega Parcial 1 — Aplicação com CRUD completo

### Critérios de avaliação

| # | Critério | Peso | Status |
|---|---|:---:|:---:|
| 1 | Projeto Spring Boot com pacotes ajustados ao projeto (não usar `demo`) | 2 | ✅ |
| 2 | CRUD completo | 4 | ✅ |
| 3 | Mínimo de 6 endpoints — verbos HTTP adequados | 1 | ✅ |
| 4 | Mínimo de 6 endpoints — códigos HTTP adequados | 1 | ✅ |
| 5 | Mínimo de 6 endpoints — retorno estruturado | 1 | ✅ |
| 6 | Ao menos um `@PathVariable`, um `@RequestParam` e um `@RequestBody` | 1 | ✅ |
| 7 | Estruturação MVC adequada ao projeto | 3 | ✅ |
| 8 | Uso de Lombok e `record` | 2 | ✅ |
| 9 | Uso de DTOs | 2 | ✅ |
| | **Total** | **17** | |

**Onde cada critério é atendido:**

**1 · Pacotes** — o pacote base é `uniamerica.abarbeirados`, definido na geração do
projeto. Nenhum vestígio de `com.example.demo` em nenhum arquivo.

**2 · CRUD completo** — três entidades com o ciclo inteiro (criar, listar, buscar,
atualizar, excluir), cada uma com model, repository, service, mapper e DTOs
próprios: `Cliente`, `Servico` e `Agendamento`.

**3 · Verbos** — 17 endpoints usando os cinco verbos: `GET` (7), `POST` (3),
`PUT` (3), `PATCH` (1) e `DELETE` (3). O `PATCH` é do avanço de status do
agendamento, que altera um campo só e por isso não é um `PUT`.

**4 · Códigos HTTP**

| Situação | Código |
|---|---|
| Criação | `201 Created` |
| Leitura e atualização | `200 OK` |
| Exclusão | `204 No Content` |
| Erro de validação | `400 Bad Request` |
| Recurso ou rota inexistente | `404 Not Found` |
| Exclusão de registro em uso | `409 Conflict` |

**5 · Retorno estruturado** — nenhum endpoint devolve entidade JPA: tudo passa por
DTO de resposta. Os erros seguem o formato único `ApiError`, montado no
`GlobalException`, com `fields` campo a campo quando é validação.

**6 · Parâmetros** — `@PathVariable` em todas as rotas `/{id}` (10 usos),
`@RequestParam` nos filtros de listagem (5 usos: `?nome=`, `?busca=`, `?data=`,
`?apenasAtivos=`) e `@RequestBody` nos `POST`, `PUT` e `PATCH` (7 usos).

**7 · MVC** — oito camadas separadas: `controller`, `service`, `repository`,
`mapper`, `dto`, `model`, `exception` e `config`. O controller só conhece DTOs — a
entidade JPA não é importada por nenhum dos três. A regra de negócio e o acesso ao
repositório ficam no service, que é o único a montar entidade, e a conversão
entidade ↔ DTO fica isolada nos mappers, todos `@Component` injetados.

**8 · Lombok e `record`** — Lombok em 9 arquivos: `@Getter`, `@Setter`,
`@NoArgsConstructor`, `@AllArgsConstructor` e `@Builder` nas entidades;
`@RequiredArgsConstructor` nos controllers e services, que dispensa o
`@Autowired` em campo. `record` nos 9 DTOs, sem exceção.

**9 · DTOs** — request e response separados por operação
(`ClienteRequest` / `ClienteResponse`), agrupados por domínio em
`dto/cliente`, `dto/servico`, `dto/agendamento` e `dto/error`. A entrada carrega
as anotações de validação; a saída expõe só o que a tela precisa ver.

### O que deve ser entregue

- Link do repositório no GitHub
- Arquivo ZIP com o `src` da aplicação

> Esta entrega é **exclusivamente backend** — o documento não menciona telas.
> O frontend Angular já foi iniciado e entra formalmente em etapa posterior.

---

## Equipe

- João Pedro Rospirski Pegorini
- Cauã Buch Domingues
- Christopher Adam
- Leonardo Barth

---

## Tecnologias

| Camada | Tecnologia | Versão | Observação |
|---|---|---|---|
| Backend | Java | 17 | Baseline do Spring Boot 4.x |
| | Spring Boot | 4.1.0 | Web MVC + Data JPA |
| | Maven | 3.9.16 | Via wrapper (`mvnw`), sem instalação |
| | Lombok | — | Gerenciado pelo Spring Boot |
| Banco | PostgreSQL | 18 | Banco da aplicação |
| | H2 | — | Só nos testes, em memória |
| Frontend | Angular | 19 | Listagem e formulário de agendamento |
| | Node.js | 20.11+ | Ver nota abaixo |
| Apoio | Docker Compose | — | Sobe o PostgreSQL sem instalar nada |
| | DBeaver, IntelliJ IDEA | — | Cliente do banco e IDE do time |

> **Node.js:** o Angular 19 exige `^18.19.1`, `^20.11.1` ou `^22.x`. A linha 14 não é
> suportada e falha na instalação do Angular CLI. Use **20.11 LTS ou superior**.
> O Node 24 compila e roda, mas o CLI o marca como *Unsupported* — se aparecer erro
> estranho no `ng serve`, essa é a primeira suspeita.

> **Spring Boot 4** renomeou artefatos: `starter-web` virou `starter-webmvc` e
> `starter-test` foi dividido em `webmvc-test` e `data-jpa-test`. Tutoriais de
> Boot 2/3 quebram o build — consulte a
> [documentação da 4.1.0](https://docs.spring.io/spring-boot/4.1.0/).

---

## Estrutura

```
docker-compose.yml    PostgreSQL 18 para o desenvolvimento

back/src/main/java/uniamerica/abarbeirados/
├── config/       WebConfig (CORS)
├── controller/   Cliente, Servico, Agendamento
├── dto/          records de request e response, por domínio
├── exception/    GlobalException (@RestControllerAdvice) e exceções próprias
├── mapper/       conversão entidade ↔ DTO
├── model/        entidades JPA e o enum StatusAgendamento
├── repository/   interfaces JpaRepository
└── service/      regras de negócio

back/src/main/resources/
├── application.properties   conexão com o PostgreSQL, via variáveis de ambiente
└── data.sql                 catálogo de serviços, com INSERT repetível

back/src/test/resources/
└── application.properties   H2 em memória, só para os testes

front/src/app/
├── core/         models, services e utilitários compartilhados
└── features/     agenda/ (listagem) e agendamento/ (formulário), por rota
```

---

## API

Base: `http://localhost:8080`

### Clientes

| Verbo | Rota | Retorno |
|---|---|---|
| `POST` | `/api/clientes` | `201` · `400` |
| `GET` | `/api/clientes?nome=` | `200` |
| `GET` | `/api/clientes/{id}` | `200` · `404` |
| `PUT` | `/api/clientes/{id}` | `200` · `404` |
| `DELETE` | `/api/clientes/{id}` | `204` · `404` · `409` |

### Serviços

| Verbo | Rota | Retorno |
|---|---|---|
| `POST` | `/api/servicos` | `201` · `400` |
| `GET` | `/api/servicos?nome=&apenasAtivos=` | `200` |
| `GET` | `/api/servicos/{id}` | `200` · `404` |
| `PUT` | `/api/servicos/{id}` | `200` · `404` |
| `DELETE` | `/api/servicos/{id}` | `204` · `404` · `409` |

### Agendamentos

| Verbo | Rota | Retorno |
|---|---|---|
| `POST` | `/api/agendamentos` | `201` · `400` · `404` |
| `GET` | `/api/agendamentos?busca=&data=` | `200` |
| `GET` | `/api/agendamentos/agenda` | `200` |
| `GET` | `/api/agendamentos/{id}` | `200` · `404` |
| `PUT` | `/api/agendamentos/{id}` | `200` · `404` |
| `PATCH` | `/api/agendamentos/{id}/status` | `200` · `404` |
| `DELETE` | `/api/agendamentos/{id}` | `204` · `404` |

O agendamento aponta para `Cliente` e `Servico` por chave estrangeira, mas guarda
`valor` e `duracaoMinutos` copiados do serviço no momento da marcação: se o preço
do catálogo mudar depois, o histórico continua mostrando quanto foi cobrado de fato.

Erros seguem sempre o mesmo formato:

```json
{
  "timestamp": "2026-08-17T10:22:41.502981",
  "status": 404,
  "error": "Not Found",
  "message": "Cliente não encontrado com id: 999",
  "fields": null
}
```

Em erro de validação, `fields` traz o motivo campo a campo.

---

## Como executar

### Banco de dados

O backend não sobe sem o PostgreSQL no ar, então este é o primeiro passo.

**Com Docker** (caminho recomendado — não exige instalar o PostgreSQL):

```bash
docker compose up -d      # na raiz do projeto
```

**Sem Docker:** instale o **PostgreSQL 18** e crie uma base `abarbeirados`. Os
padrões esperados são `localhost:5432`, usuário `postgres`, senha `postgres`.

Qualquer um dos dois caminhos serve — o backend não sabe a diferença.

> **Porta 5432 ocupada?** Acontece quando já existe outro PostgreSQL na máquina.
> Exporte a porta alternativa antes de subir qualquer coisa:
>
> ```bash
> export DB_PORT=5433
> ```
>
> A mesma variável é lida pelo `docker-compose.yml` e pelo `application.properties`,
> então o container e o backend se movem juntos e não há como um apontar para um
> lugar e o outro para outro. Vale o mesmo para `DB_HOST`, `DB_NAME`, `DB_USER` e
> `DB_PASSWORD`.

**Inspecionar o banco** (DBeaver, IntelliJ ou `psql`):

| Campo | Valor |
|---|---|
| Host / Porta | `localhost` / `5432` |
| Base | `abarbeirados` |
| Usuário | `postgres` |
| Senha | `postgres` |

O esquema é criado pelo Hibernate na primeira execução (`ddl-auto=update`), e o
`data.sql` insere o catálogo de serviços. Esse catálogo **não é dado de teste**: a
tela de agendamento traduz a combinação marcada no carrinho para um serviço
procurando pelo nome, então sem ele não há o que agendar. O script roda a cada
inicialização, mas cada `INSERT` é condicionado a um `WHERE NOT EXISTS` — reiniciar
não duplica nada.

### Backend

**Pelo IntelliJ IDEA** (caminho padrão do time): abra a pasta do projeto, confirme o
SDK como **JDK 17** em *File → Project Structure → Project* e execute
`AbarbeiradosApplication`.

**Pelo terminal:**

```bash
cd back
./mvnw spring-boot:run      # Linux / macOS
mvnw.cmd spring-boot:run    # Windows
```

> O terminal exige `java` no `PATH` e `JAVA_HOME` apontando para o JDK 17. Quem usa
> apenas o IntelliJ não precisa configurar nada — a IDE resolve o JDK internamente.

A aplicação sobe em `http://localhost:8080`. Se o banco não estiver no ar, o boot
falha na criação do pool de conexões — é o sintoma esperado, não um defeito.

**Testes:**

```bash
cd back
./mvnw test
```

Os testes usam **H2 em memória**, e não o PostgreSQL: o teste de contexto sobe a
aplicação inteira, e amarrá-lo ao banco real faria `./mvnw test` falhar em toda
máquina que ainda não tivesse subido o container. A configuração de teste fica em
`back/src/test/resources/application.properties`.

### Frontend

```bash
cd front
npm install
npm start
```

A aplicação sobe em `http://localhost:4200`. O `proxy.conf.json` encaminha `/api`
para a porta 8080, então não há CORS em desenvolvimento — **suba o backend antes**.

---

## Convenções

**Branches:** `main` (estável) · `developer` (integração) ·
`feature/<descricao>` · `fix/<descricao>`.
Trabalhe em branch própria e integre via Pull Request.

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/) —
`feat`, `fix`, `refactor`, `docs`, `chore`, `test`.
Exemplo: `feat: adiciona endpoint de listagem de clientes`

---

## Próximos passos

- [ ] Receber o documento de especificação do demandante
- [x] Modelar as entidades do domínio
- [x] Estruturar as camadas MVC (`model`, `repository`, `service`, `controller`)
- [x] Implementar DTOs como `record`
- [x] Implementar o CRUD e os 6 endpoints
- [x] Inicializar o frontend Angular 19
- [x] Formulário de marcação (frontend)
- [x] Listagem de agendamentos com troca de status (frontend)
- [x] Ligar o frontend à API — não há mais dado em memória
- [x] Migrar de H2 para PostgreSQL 18
- [ ] Validar conflito de horário no backend (dois agendamentos no mesmo intervalo)
- [ ] Permitir valor e duração personalizados no agendamento (caso da Química)
- [ ] Telas de manutenção de Cliente e Serviço — o CRUD dos dois já existe na API
- [ ] Testes automatizados — só existe o teste de contexto gerado pelo Spring

---

Projeto acadêmico — Uniamerica, 2026.
