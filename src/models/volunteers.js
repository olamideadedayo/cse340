import db from './db.js'; // Adjust this path if your pool setup is located elsewhere

/**
 * Add a user as a volunteer to a project
 */
export const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING
        RETURNING volunteer_id;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows[0];
};

/**
 * Remove a user from a project's volunteer list
 */
export const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rowCount > 0; // Returns true if a record was actually deleted
};

/**
 * Retrieve all projects a specific user has signed up to volunteer for
 */
export const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT p.id, p.title, p.description, pv.joined_at
        FROM projects p
        INNER JOIN project_volunteers pv ON p.id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY pv.joined_at DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

/**
 * Check if a specific user is already volunteering for a specific project
 */
export const isUserVolunteering = async (projectId, userId) => {
    const query = `
        SELECT 1 FROM project_volunteers 
        WHERE project_id = $1 AND user_id = $2;
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0; // Returns true or false
};
