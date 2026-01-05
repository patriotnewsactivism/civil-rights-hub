SELECT 'Activists:' as type, COUNT(*) as count FROM activists UNION ALL SELECT 'Attorneys:', COUNT(*) FROM attorneys UNION ALL SELECT 'Federal Laws:', COUNT(*) FROM federal_laws;
