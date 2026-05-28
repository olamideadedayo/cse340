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
