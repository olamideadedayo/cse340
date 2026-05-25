import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        ORDER BY date;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };