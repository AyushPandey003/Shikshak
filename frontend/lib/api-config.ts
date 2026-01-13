/**
 * Centralized API configuration for the frontend
 * Uses NEXT_PUBLIC_API_GATEWAY_URL environment variable in production
 */

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_GATEWAY_URL;

export const API_CONFIG = {
    // Base URL for API Gateway
    baseUrl: API_GATEWAY_URL,

    // Service endpoints (all proxied through API Gateway)
    auth: `${API_GATEWAY_URL}/authentication`,
    material: `${API_GATEWAY_URL}/material`,
    courses: `${API_GATEWAY_URL}/material/courses`,
    modules: `${API_GATEWAY_URL}/material/module`,
    upload: `${API_GATEWAY_URL}/material/upload`,
    reviews: `${API_GATEWAY_URL}/material/reviews`,
    tests: `${API_GATEWAY_URL}/material/tests`,
    rag: `${API_GATEWAY_URL}/rag`,
    payment: `${API_GATEWAY_URL}/payment`,
};

export default API_CONFIG;
