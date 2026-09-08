-- Comptes de demonstration. Mot de passe commun : Passer@123
-- Hash BCrypt cost 10, prefixe $2a$ compatible BCryptPasswordEncoder.

INSERT INTO utilisateurs (id, email, mot_de_passe, role, actif, cree_le) VALUES
                                                                             ('a1111111-1111-4111-8111-111111111111', 'admin@inscription.com',
                                                                              '$2a$10$AvCWelq1Mp.9coCpEesUW.Rm8dPonoKlETE0a0MKuSTmBNtdH0xV6',
                                                                              'ADMIN', TRUE, NOW()),
                                                                             ('a2222222-2222-4222-8222-222222222222', 'agent@inscription.com',
                                                                              '$2a$10$AvCWelq1Mp.9coCpEesUW.Rm8dPonoKlETE0a0MKuSTmBNtdH0xV6',
                                                                              'AGENT', TRUE, NOW()),
                                                                             ('a3333333-3333-4333-8333-333333333333', 'candidat@inscription.com',
                                                                              '$2a$10$AvCWelq1Mp.9coCpEesUW.Rm8dPonoKlETE0a0MKuSTmBNtdH0xV6',
                                                                              'CANDIDAT', TRUE, NOW())
    ON CONFLICT (email) DO UPDATE
                               SET mot_de_passe = EXCLUDED.mot_de_passe,
                               role = EXCLUDED.role,
                               actif = TRUE;