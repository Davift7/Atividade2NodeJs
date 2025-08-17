
//import de depencendias baixadas
import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
//import de utilis
import { UnauthorizedError } from '../utils/errors';
import { AuthenticationError } from '../utils/errors';
import { NotFoundError } from '../utils/errors';
//Imports do Service
import { postCreatePostService } from '../services/post-service';
import { getPostService } from '../services/post-service';
import { deletePostService } from '../services/post-service';
import { patchAttPostService } from '../services/post-service';
import { getPostIdService } from '../services/post-service';
import { getLikesByPostService } from '../services/post-service';
import { getcommentsByPosttService } from '../services/post-service';


export async function postCreatePostController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const dataPost = request.body;
        const userId = request.user.id;

        const newPost = await postCreatePostService(userId, dataPost)

        return reply.status(201).send(newPost)

    } catch (err) {
        if (err instanceof z.ZodError) {
            return reply.status(400).send({
                error: "Validation Failed",
                issues: err.flatten().fieldErrors
            })
        }
        console.error(err)
        return reply.status(500).send({
            error: "Internal Server Error"
        })
    }
}
export async function getPostController(request: FastifyRequest, reply: FastifyReply) {
    try {

        const getPost = await getPostService()

        return reply.status(200).send(getPost)

    } catch (err) {
        console.error(err)
        return reply.status(500).send({
            error: "Internal Server Error"
        })
    }
}
export async function deletePostController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        await deletePostService(id, userId)

        return reply.status(204).send();

    } catch (err) {
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function patchAttPostController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;
        const dataToUpdate = request.body
        const updatedPost = await patchAttPostService(id, userId, dataToUpdate)

        return reply.status(200).send(updatedPost);

    } catch (err) {
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });

        }

        if (err instanceof z.ZodError) {
            return reply.status(400).send({ error: "Validation Failed", issues: err.flatten().fieldErrors });
        }

        if (err.code === 'P2025') {
            return reply.status(404).send({ error: 'Post not found' });
        }

        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
export async function getPostIdController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };

        const post = await getPostIdService(id)

        return reply.status(200).send(post);
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
export async function getLikesByPostController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { postId } = request.params as { postId: string };

        const likes = await getLikesByPostService(postId)

        return reply.status(200).send(likes);

    } catch (err) {

        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message })
        }

        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function getcommentsByPostController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { postId } = request.params as { postId: string };

        const comments = await getcommentsByPosttService(postId);

        return reply.status(200).send(comments);

    } catch (err) {

        if (err instanceof NotFoundError) {
            return reply.status(404).send({ error: err.message })
        }
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}




