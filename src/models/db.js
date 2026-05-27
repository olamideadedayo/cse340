import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Detect if we are running on Render (or production)
 */
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

/**
 * DB wrapper
 */
let db;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            const start = Date.now();
            const res = await pool.query(text, params);
            const duration = Date.now() - start;

            console.log('Executed query:', {
                text: text.replace(/\s+/g, ' ').trim(),
                duration: `${duration}ms`,
                rows: res.rowCount
            });

            return res;
        },

        async close() {
            await pool.end();
        }
    };
} else {
    db = pool;
}

/**
 * Test connection
 */
const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { db as default, testConnection };