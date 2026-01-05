-- Comprehensive Database Seeding Migration
-- This migration ensures all tables have sample data for demonstration purposes

-- Seed violations table with sample civil rights violation reports
INSERT INTO violations (title, description, location_state, location_city, incident_date, latitude, longitude, status)
VALUES
  ('Police Destroyed Recording Device', 'Officers confiscated and destroyed my phone while I was filming a traffic stop from the sidewalk. This happened at Main St and 5th Ave.', 'California', 'Los Angeles', '2025-12-15', 34.0522, -118.2437, 'pending'),
  ('Unlawful Search During Protest', 'During a peaceful protest, police conducted warrantless searches of backpacks without probable cause.', 'New York', 'New York City', '2025-11-22', 40.7128, -74.0060, 'verified'),
  ('Excessive Force at Traffic Stop', 'Officer used excessive force during a routine traffic stop, resulting in injuries. Dash cam footage available.', 'Texas', 'Houston', '2025-10-08', 29.7604, -95.3698, 'pending'),
  ('Voting Access Denied', 'Poll workers turned away eligible voters citing invalid reasons. Multiple witnesses present.', 'Georgia', 'Atlanta', '2025-11-05', 33.7490, -84.3880, 'resolved'),
  ('Housing Discrimination', 'Landlord refused rental application based on national origin despite meeting all qualifications.', 'Illinois', 'Chicago', '2025-09-15', 41.8781, -87.6298, 'pending'),
  ('First Amendment Retaliation', 'Arrested for filming police from public property. All charges were later dropped.', 'Florida', 'Miami', '2025-12-20', 25.7617, -80.1918, 'verified')
ON CONFLICT DO NOTHING;

-- Seed violation_comments (ensure parent violations exist)
INSERT INTO violation_comments (violation_id, content, username)
SELECT
  v.id,
  'This is a clear violation of First Amendment rights. Consider filing a complaint with the ACLU.',
  'Civil Rights Advocate'
FROM violations v
WHERE v.title = 'Police Destroyed Recording Device'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Note: Most other tables should already be seeded by previous migration files
-- This migration focuses on violations which are user-generated content

-- Verify seed counts
DO $$
DECLARE
  violation_count INT;
  attorney_count INT;
  activist_count INT;
  federal_law_count INT;
BEGIN
  SELECT COUNT(*) INTO violation_count FROM violations;
  SELECT COUNT(*) INTO attorney_count FROM attorneys;
  SELECT COUNT(*) INTO activist_count FROM activists;
  SELECT COUNT(*) INTO federal_law_count FROM federal_laws;

  RAISE NOTICE 'Seed verification:';
  RAISE NOTICE '  Violations: %', violation_count;
  RAISE NOTICE '  Attorneys: %', attorney_count;
  RAISE NOTICE '  Activists: %', activist_count;
  RAISE NOTICE '  Federal Laws: %', federal_law_count;
END $$;
