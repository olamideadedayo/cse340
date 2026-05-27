-- Create Table: Organization
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert Data: Organization
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure...', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability...', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities...', 'hello@unityserve.org', 'unityserve-logo.png');


-- ==========================================
-- ADD THIS MISSING PROJECT TABLE HERE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- Insert Sample Projects (So your upcoming projects page has rows to show)
INSERT INTO public.project (organization_id, title, description, location, date) VALUES
(1, 'Community Park Cleanup', 'Helping clear out debris and plant local greenery.', 'Lagos Central Park', '2026-06-15'),
(2, 'Urban Farm Harvest Assistance', 'We need hands gathering crop yields for distribution.', 'GreenHarvest Facility', '2026-07-20');


-- 1. Create the Category table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create the Junction Table to link Projects and Categories (Now it works!)
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT REFERENCES public.project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES public.category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- 3. Insert categories
INSERT INTO public.category (name) VALUES 
('Environmental / Cleanup'),
('Education / Tutoring'),
('Elderly Care'),
('Food Security');

-- 4. Associate your projects with categories
INSERT INTO public.project_category (project_id, category_id) VALUES 
(1, 1), 
(1, 4), 
(2, 2);