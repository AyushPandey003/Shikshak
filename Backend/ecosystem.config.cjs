// PM2 Ecosystem Configuration for Unified Backend Container
// Manages all Node.js services in a single container

module.exports = {
    apps: [
        {
            name: 'apigateway',
            cwd: '/app/ApiGateway',
            script: 'index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT_GATEWAY: 4000
            },
            // Internal service URLs (localhost since all in same container)
            env_production: {
                AUTH_SERVICE_URL: 'http://localhost:3000',
                COURSES_SERVICE_URL: 'http://localhost:4002',
                PAYMENT_SERVICE_URL: 'http://localhost:4003',
                // RAG is external (hosted separately)
                RAG_SERVICE_URL: process.env.RAG_SERVICE_URL
            }
        },
        {
            name: 'auth',
            cwd: '/app/Auth',
            script: 'dist/server.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        },
        {
            name: 'courses',
            cwd: '/app/Courses',
            script: 'index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT_COURSES: 4002
            }
        },
        {
            name: 'payment',
            cwd: '/app/payment',
            script: 'index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 4003
            }
        }
    ]
};
