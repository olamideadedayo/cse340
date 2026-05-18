import db from './db.js';

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `;

    const result = await db.query(query);
    return result.rows;
}

// ⚠️ FIX: Ensure this exact line is at the very bottom of the file
export { getAllOrganizations };