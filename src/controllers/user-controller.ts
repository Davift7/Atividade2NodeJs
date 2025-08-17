
//import de depencendias baixadas
import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
//import de utilis
import { UnauthorizedError } from '../utils/errors';
import { AuthenticationError } from '../utils/errors';
//Imports do Service
import { getUserReadService } from '../services/user-service';
import { postCreatUserService } from '../services/user-service';
import { postAcessLoginService } from '../services/user-service';
import { getUserCommentsService } from '../services/user-service';
import { getUserLikesService } from '../services/user-service';
import { getUserPostsService } from '../services/user-service';
import { getUserService } from '../services/user-service';
import { patchAttUserService } from '../services/user-service';
import { deleteUserService } from '../services/user-service';


//Leitura de comentários com base no usuário
export async function getUserCommentsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { userId } = request.params as { userId: string };

        const comments = await getUserCommentsService(userId); // Use await

        return reply.status(200).send(comments); // Envie os dados retornados pelo serviço

    } catch (error) {
        if (error.message === "User not found") {
            return reply.status(404).send({ error: "User not found" });
        }
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
//leitura de likes com base no Usuário
export async function getUserLikesController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { userId } = request.params as { userId: string };

        const likes = await getUserLikesService(userId)


        return reply.status(200).send(likes);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
};
export async function getUserPostsController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { userId } = request.params as { userId: string };

        const posts = await getUserPostsService(userId)

        return reply.status(200).send(posts);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }


}
export async function getUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };

        const user = await getUserService(id)

        return reply.status(200).send(user);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function patchAttUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;
        const dataToUpdate = request.body as any; 

        const updatedUser = await patchUserService(id, dataToUpdate, userId) // Chamada CORRIGIDA

        return reply.status(200).send(updatedUser);

    } catch (err) {
        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }
        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;

        await deleteUserService(id, userId)

        return reply.status(204).send();

    } catch (err) {

        if (err instanceof UnauthorizedError) {
            return reply.status(403).send({ error: err.message });
        }

        if (err.code === 'P2025') {
            return reply.status(404).send({ error: 'User not found' });
        }

        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
}
export async function getUserReadController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getUsers = await getUserReadService();

        return reply.status(200).send(getUsers)

    } catch (err) {
        console.error(err)
        return reply.status(500).send({
            error: "Internal Server Error"
        })
    }
}
export async function postCreatUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const dataUser = request.body

        const createUser = await postCreatUserService(dataUser)

        return reply.status(201).send(createUser)

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

export async function postAcessLoginController(request: FastifyRequest, reply: FastifyReply) {
    try {
        const dataLogin = request.body

        const token = await postAcessLoginService(dataLogin);

        return reply.status(200).send({
            message: 'Login successful',
            token: token,
        });

    } catch (err) {
        if (err instanceof AuthenticationError) {
            return reply.status(401).send({ error: err.message });
        }
        if (err instanceof z.ZodError) {
            return reply.status(400).send({
                error: "Validation Failed",
                issues: err.flatten().fieldErrors
            });
        }

        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
};









