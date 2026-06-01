import pool from './db.js'; // Adjust if your pool connection file is named differently (e.g., database.js)

/**
 * 1. Retrieve a single category by its ID
 */
export async function getCategoryById(categoryId) {
    const sql = 'SELECT category_id, name FROM public.category WHERE category_id = $1;';
    const result = await pool.query(sql, [categoryId]);
    return result.rows[0];
}

/**
 * 2. Retrieve all service projects for a given category
 */
export async function getProjectsByCategoryId(categoryId) {
    const sql = `
        SELECT p.project_id, p.title, p.description, p.location, p.date 
        FROM public.project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;`;
    const result = await pool.query(sql, [categoryId]);
    return result.rows;
}

/**
 * 3. Retrieve all categories for a given service project
 */
export async function getCategoriesByProjectId(projectId) {
    const sql = `
        SELECT c.category_id, c.name 
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;`;
    const result = await pool.query(sql, [projectId]);
    return result.rows;
}

/**
 * 4. Insert a new category into the database
 */
export async function createCategory(name) {
    try {
        const sql = `
            INSERT INTO public.category (name)
            VALUES ($1)
            RETURNING category_id;`;
        const result = await pool.query(sql, [name]);
        
        if (result.rows.length === 0) {
            throw new Error('Failed to create category.');
        }
        return result.rows[0].category_id;
    } catch (error) {
        console.error('Database Error in createCategory:', error);
        throw error;
    }
}

/**
 * 5. Update an existing category name
 */
export async function updateCategory(categoryId, name) {
    try {
        const sql = `
            UPDATE public.category
            SET name = $1
            WHERE category_id = $2
            RETURNING *;`;
        const result = await pool.query(sql, [name, categoryId]);
        
        if (result.rowCount === 0) {
            throw new Error('Category update failed: Category record not found.');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Database Error in updateCategory:', error);
        throw error;
    }
}

