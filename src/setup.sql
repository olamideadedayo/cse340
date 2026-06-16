-- =========================================================================
-- CSE 340 SERVICE NETWORK GLOBAL SCHEMA SETUP
-- =========================================================================

-- 1. Create Organization Table
CREATE TABLE IF NOT EXISTS public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- 2. Create Project Table (Depends on Organization)
CREATE TABLE IF NOT EXISTS public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES public.organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- 3. Create Category Table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Create Project_Category Junction Table (Depends on Project & Category)
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT REFERENCES public.project(project_id) ON DELETE CASCADE,
    category_id INT REFERENCES public.category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- 5. Create Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- 6. Create Users Table (Depends on Roles)
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES public.roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- SEED DATA INSERTIONS
-- =========================================================================

-- Seed Organizations (Using ON CONFLICT to avoid errors on duplicate script runs)
INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure...', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability...', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities...', 'hello@unityserve.org', 'unityserve-logo.png')
ON CONFLICT DO NOTHING;

-- Seed Sample Projects
INSERT INTO public.project (organization_id, title, description, location, date) VALUES
(1, 'Community Park Cleanup', 'Helping clear out debris and plant local greenery.', 'Lagos Central Park', '2026-06-15'),
(2, 'Urban Farm Harvest Assistance', 'We need hands gathering crop yields for distribution.', 'GreenHarvest Facility', '2026-07-20')
ON CONFLICT DO NOTHING;

-- Seed Categories
INSERT INTO public.category (name) VALUES 
('Environmental / Cleanup'),
('Education / Tutoring'),
('Elderly Care'),
('Food Security')
ON CONFLICT (name) DO NOTHING;

-- Seed Project-to-Category Associations
INSERT INTO public.project_category (project_id, category_id) VALUES 
(1, 1), 
(1, 4), 
(2, 2)
ON CONFLICT DO NOTHING;

-- Seed Application Access Roles
INSERT INTO public.roles (role_name, r.role_description) VALUES 
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;


CREATE TABLE IF NOT EXISTS project_volunteers (
    volunteer_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id) -- Ensures a user cannot sign up for the exact same project twice
);
