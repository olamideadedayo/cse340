import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function query(text, params) {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('Error in query:', {
            text,
            error: error.message
        });
        throw error;
    }
}

export async function testConnection() {
    try {
        const result = await query('SELECT NOW() as current_time');
        console.log('Database connected successfully');
        console.log(result.rows[0]);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

export default {
    query,
    testConnection
};