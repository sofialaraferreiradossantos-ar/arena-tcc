USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - CLIENTES E FATURAS NO STRIPE
-- Execute uma única vez, depois do 011. Não apaga registros existentes.
--
-- usuarios.stripe_customer_id: id do cliente no Stripe (cus_...).
--   Criado na primeira vez que o cliente paga online ou recebe uma fatura.
--
-- pagamentos.stripe_invoice_id: id da fatura do Stripe (in_...).
--   Uma fatura mensal junta várias reservas, então vários pagamentos
--   podem ter o mesmo stripe_invoice_id. NULL nos demais pagamentos.
--
-- Novo valor usado pelo sistema:
--   forma_pag = 'Fatura' (reserva cobrada na fatura mensal do cliente)
-- =====================================================

ALTER TABLE usuarios
    ADD COLUMN stripe_customer_id VARCHAR(255) NULL AFTER dt_cad,
    ADD UNIQUE KEY uq_usuarios_stripe_customer (stripe_customer_id);

ALTER TABLE pagamentos
    ADD COLUMN stripe_invoice_id VARCHAR(255) NULL AFTER stripe_session_id,
    ADD KEY ix_pagamentos_stripe_invoice (stripe_invoice_id);
