import db from './db.js';
import pool from './db.js';

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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];

    const result = await db.query(query, queryParams);

    return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

// Function to update an existing service project in the database
async function updateProject(projectId, title, description, location, date, organizationId) {
    try {
        const sql = `
            UPDATE project 
            SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
            WHERE project_id = $6
            RETURNING *;
        `;
        
        const result = await db.query(sql, [title, description, location, date, organizationId, projectId]);
        
        // If the update affected 0 rows, it means the project ID wasn't found
        if (result.rowCount === 0) {
            throw new Error('Project update failed: Project record not found.');
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Database Error in updateProject:', error);
        throw error;
    }
}

export async function getUpcomingProjects(number_of_projects) {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1
    `;

    const result = await pool.query(sql, [number_of_projects]);

    return result.rows;
}

export async function getProjectDetails(id) {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];
}


export {
    getAllProjects,
    getProjectsByOrganizationId,
    createProject,
    updateProject
};