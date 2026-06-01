import db from './db.js';

// Get all categories
const getAllCategories = async () => {
    try {
        const query = `
            SELECT category_id, name
            FROM public.category
            ORDER BY name ASC;
        `;

        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        console.error("Error in getAllCategories model:", error.message);
        throw error;
    }
};

// Get single category by ID
const getCategoryById = async (categoryId) => {
    try {
        const query = `
            SELECT *
            FROM public.category
            WHERE category_id = $1;
        `;

        const result = await db.query(query, [categoryId]);
        return result.rows[0];

    } catch (error) {
        console.error("Error in getCategoryById model:", error.message);
        throw error;
    }
};

// Get all categories for a project
const getCategoriesByProjectId = async (projectId) => {
    try {
        const query = `
            SELECT c.category_id, c.name
            FROM public.category c
            JOIN public.project_category pc
                ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.name ASC;
        `;

        const result = await db.query(query, [projectId]);
        return result.rows;

    } catch (error) {
        console.error("Error in getCategoriesByProjectId model:", error.message);
        throw error;
    }
};

// Get all projects for a category
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const query = `
            SELECT p.*
            FROM public.project p
            JOIN public.project_category pc
                ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.date ASC;
        `;

        const result = await db.query(query, [categoryId]);
        return result.rows;

    } catch (error) {
        console.error("Error in getProjectsByCategoryId model:", error.message);
        throw error;
    }
};

// Helper function to insert a single link (used only internally)
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    // Assumes your file imports the database connection as 'db'
    await db.query(query, [categoryId, projectId]);
};

// Main function to replace project categories cleanly
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // 1. Wipe out any existing category mappings for this specific project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // 2. Loop through and rebuild the selections safely
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};



export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments
};