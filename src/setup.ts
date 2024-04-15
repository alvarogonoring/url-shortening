import {sql} from './lib/postgres';

async function setup() {
    await sql`CREATE TABLE IF NOT EXISTS url_shortening(
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        original_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql.end();

    console.log('Setup successfully ended!')
}

setup();