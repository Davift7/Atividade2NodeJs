import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.SECRET_KEY;

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Authentication token missing or invalid' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        request.user = decoded;
    } catch (err) {
        return reply.status(401).send({ error: 'Authentication token is invalid' });
    }
}