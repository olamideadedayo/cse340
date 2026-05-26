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
        FROM projects p
        JOIN organizations o
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
        FROM projects p
        JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0];
}

export {
    getAllProjects,
    getProjectsByOrganizationId
};