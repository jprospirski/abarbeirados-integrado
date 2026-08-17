-- Catalogo de servicos.
--
-- Nao e dado de teste: a tela de agendamento traduz a combinacao marcada no
-- carrinho para UM servico, procurando pelo NOME (ver COMBINACOES no
-- agendamento.service.ts do front). Sem estas oito linhas a combinacao nao
-- resolve e nao ha o que agendar — por isso o catalogo nasce com o banco.
--
-- Os nomes precisam bater exatamente com os do front, acento incluido.
--
-- O script roda a cada boot (spring.sql.init.mode=always). O WHERE NOT EXISTS e
-- o que o torna repetivel: sem ele, cada reinicio duplicaria o catalogo inteiro
-- agora que o banco persiste. Comparar por nome em vez de id porque o id quem
-- gera e a sequence.

-- ----------------------------------------------------------------- avulsos --

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Corte', 50.00, 40, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Corte');

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Barba', 30.00, 20, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Barba');

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Sobrancelha', 20.00, 20, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Sobrancelha');

-- Valor e duracao aqui sao so o padrao que aparece na tela; a quimica e cobrada
-- caso a caso, e o campo personalizado do formulario cuida disso.
INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Química', 120.00, 90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Química');

-- ------------------------------------------------------------------ combos --
-- Cada combo custa menos que a soma dos avulsos. E dessa diferenca que sai o
-- selo "Combo -R$ x" do formulario.

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Corte + Barba', 75.00, 60, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Corte + Barba');

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Corte + Sobrancelha', 65.00, 60, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Corte + Sobrancelha');

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Barba + Sobrancelha', 45.00, 40, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Barba + Sobrancelha');

INSERT INTO servico (nome, valor, duracao_minutos, ativo)
SELECT 'Corte + Barba + Sobrancelha', 90.00, 80, TRUE
WHERE NOT EXISTS (SELECT 1 FROM servico WHERE nome = 'Corte + Barba + Sobrancelha');
