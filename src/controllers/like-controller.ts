
//import de depencendias baixadas
import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
//import de utilis
import { UnauthorizedError,AuthenticationError,NotFoundError,ConflictError } from '../utils/errors';

//Imports do Service
import { postCreateLikeService,deleteLikeService,getLikeByIdService   } from '../services/like-service';

export async function postCreateLikeController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user.id;
        const { postId, commentId } = request.body as { postId?: string, commentId?: string };

        const newLike = await postCreateLikeService(postId, userId, commentId);
        
        return reply.status(201).send(newLike);

    } catch (err) {
        if (err instanceof z.ZodError) {
            return reply.status(400).send({ error: "Validation Failed", issues: err.flatten().fieldErrors });
        }
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }
        if (err instanceof ConflictError) {
            return reply.status(409).send({ error: err.message });
        }
        
        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
export async function deleteLikeController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        await deleteLikeService(id, userId);

        return reply.status(204).send();

    } catch (err) {
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }
        if (err.code === 'P2025') {
            return reply.status(404).send({ error: 'Like not found' });
        }

        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function getLikeByIdController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };

        const like = await getLikeByIdService(id);

        return reply.status(200).send(like);

    } catch (err) {
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }
        
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}