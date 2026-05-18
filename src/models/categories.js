import db from './db.js';

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
}

// ⚠️ MAKE SURE THIS EXACT LINE IS AT THE VERY BOTTOM:
export { getAllCategories };