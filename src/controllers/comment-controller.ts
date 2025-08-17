import { FastifyRequest, FastifyReply } from 'fastify';
import { NotFoundError, UnauthorizedError } from '../utils/errors';
import { z } from 'zod';
import { getCommentLikesService, getCommentByIdService, updateCommentService, deleteCommentService, getAllCommentsService, postCreateCommentService } from '../services/comment-service';
import { updateCommentSchema, createCommentSchema } from '../schemas/main-schemas';

export async function getCommentLikesController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { commentId } = request.params as { commentId: string };
        const likes = await getCommentLikesService(commentId);
        return reply.status(200).send(likes);
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
export async function getCommentByIdController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const comment = await getCommentByIdService(id);
        return reply.status(200).send(comment);
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
export async function patchCommentController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;
        const { content } = updateCommentSchema.parse(request.body);

        const updatedComment = await updateCommentService(id, userId, content);

        return reply.status(200).send(updatedComment);

    } catch (err) {
        if (err instanceof z.ZodError) {
            return reply.status(400).send({ error: "Validation Failed", issues: err.flatten().fieldErrors });
        }
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }
        if (err.code === 'P2025') {
            return reply.status(404).send({ error: 'Comment not found' });
        }

        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
export async function deleteCommentController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        await deleteCommentService(id, userId);

        return reply.status(204).send();

    } catch (err) {
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }
        if (err.code === 'P2025') {
            return reply.status(404).send({ error: 'Comment not found' });
        }

        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function getAllCommentsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const comments = await getAllCommentsService();
        return reply.status(200).send(comments);
    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function postCreateCommentController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user.id;
        const { content, postId } = createCommentSchema.parse(request.body);

        const newComment = await postCreateCommentService(userId, content, postId);

        return reply.status(201).send(newComment);

    } catch (err) {
        if (err instanceof z.ZodError) {
            return reply.status(400).send({ error: "Validation Failed", issues: err.flatten().fieldErrors });
        }
        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message });
        }

        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

