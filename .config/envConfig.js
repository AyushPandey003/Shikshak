// Centralized environment configuration loader
// Import this module at the top of your service entry point to load .config/.env

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the centralized .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default process.env;
