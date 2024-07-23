import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    JWT_SECRET: get("JWT_SECRET").required().asString(),    
    
    // Mongo
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    MONGO_USER: get('MONGO_USER').required().asString(),
    MONGO_PASS: get('MONGO_PASS').required().asString(),

    // Frontend
    FRONTEND_ORIGIN: get("FRONTEND_ORIGIN").required().asString(),
}
