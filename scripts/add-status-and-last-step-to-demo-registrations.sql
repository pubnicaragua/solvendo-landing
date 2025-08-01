ALTER TABLE demo_registrations
ADD COLUMN status TEXT DEFAULT 'pending',
ADD COLUMN last_step_completed INTEGER DEFAULT 0;
