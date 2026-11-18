USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - PAGAMENTO ONLINE COM STRIPE
-- Execute uma única vez. Não apaga registros existentes.
--
-- stripe_session_id: id da sessão do Stripe Checkout (cs_test_... / cs_live_...).
--   Preenchido só em pagamentos online; NULL nos pagamentos manuais.
--   Os dados do cartão NUNCA são gravados aqui: ficam no Stripe.
--
-- Novos valores usados pelo sistema:
--   forma_pag  = 'Online'    (enquanto o cliente não terminou de pagar;
--                             depois vira 'Pix' ou 'Cartão')
--   status_pag = 'cancelado' (cliente desistiu ou o prazo expirou)
-- =====================================================

ALTER TABLE pagamentos
    ADD COLUMN stripe_session_id VARCHAR(255) NULL AFTER status_pag,
    ADD UNIQUE KEY uq_pagamentos_stripe_session (stripe_session_id);
