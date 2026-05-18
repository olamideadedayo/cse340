-- Create Table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert Data
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');

-- Verify
SELECT * FROM organization;

-- 1. Create the Category table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create the Junction Table to link Projects and Categories
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT REFERENCES public.project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES public.category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id) -- Composite Primary Key prevents duplicate links
);

-- 3. Insert at least 3 categories
INSERT INTO public.category (name) VALUES 
('Environmental / Cleanup'),
('Education / Tutoring'),
('Elderly Care'),
('Food Security');

-- 4. Associate your existing projects with categories
-- (Replace '1' and '2' with actual IDs from your project and category tables)
INSERT INTO public.project_category (project_id, category_id) VALUES 
(1, 1), -- Project 1 is Environmental
(1, 4), -- Project 1 also relates to Food Security (Many-to-Many)
(2, 2); -- Project 2 is Education
