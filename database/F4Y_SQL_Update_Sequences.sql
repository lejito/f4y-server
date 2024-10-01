SELECT setval('public.bolsillos_id_seq', (SELECT MAX(id) FROM public.bolsillos)+1);
SELECT setval('public.cdts_id_seq', (SELECT MAX(id) FROM public.cdts)+1);
SELECT setval('public.cuentas_id_seq', (SELECT MAX(id) FROM public.cuentas)+1);
SELECT setval('public.movimientos_id_seq', (SELECT MAX(id) FROM public.movimientos)+1);
SELECT setval('public.registros_actividad_id_seq', (SELECT MAX(id) FROM public.registros_actividad)+1);
SELECT setval('public.transferencias_bolsillos_id_seq', (SELECT MAX(id) FROM public.transferencias_bolsillos)+1);
SELECT setval('public.transferencias_cdts_id_seq', (SELECT MAX(id) FROM public.transferencias_cdts)+1);
SELECT setval('public.transferencias_externas_id_seq', (SELECT MAX(id) FROM public.transferencias_externas)+1);