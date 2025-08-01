ALTER TABLE demo_registrations
ADD CONSTRAINT unique_email UNIQUE (email);
