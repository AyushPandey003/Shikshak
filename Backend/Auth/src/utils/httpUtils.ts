import { IncomingMessage, ServerResponse } from 'http';

export const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                if (!body) resolve({});
                else resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
};

export const setCorsHeaders = (req: IncomingMessage, res: ServerResponse) => {
    const allowedOrigins = ['http://localhost:4000', 'http://localhost:3001', 'http://localhost:3000'];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Default to Gateway if no origin or not allowed (optional, or strict)
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000'); 
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
};
