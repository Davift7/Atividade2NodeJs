//importação de dependencias necessárias
import { FastifyInstance } from 'fastify';
//Importação de utilits
import { authenticate } from '../utils/auth';
//Importação de controllers
import { getUserCommentsController } from '../controllers/user-controller'
import { getUserLikesController } from '../controllers/user-controller'
import { getUserPostsController } from '../controllers/user-controller'
import { getUserController } from '../controllers/user-controller'
import { patchAttUserController } from '../controllers/user-controller'
import { deleteUserController } from '../controllers/user-controller'
import { getUserReadController } from '../controllers/user-controller'
import { postCreatUserController } from '../controllers/user-controller'
import { postAcessLoginController } from '../controllers/user-controller'
import { loginJsonSchema, userJsonSchema, userUpdateJsonSchema } from '../schemas/main-schemas';



//Puxando do main schema
import { loginSchema, userSchema, userUpdateSchema } from '../schemas/main-schemas';


//teste
export async function userRoutes(app: FastifyInstance) {
    app.get('/user/:userId/comments', getUserCommentsController);
    app.get('/user/:userId/likes', getUserLikesController);
    app.get('/user/:userId/posts', getUserPostsController);
    app.get('/user/:id', getUserController);
    app.get('/users', getUserReadController)
    app.patch('/user/:id', {
        preHandler: [authenticate],
        schema: { body: userUpdateJsonSchema }
    }, patchAttUserController);
    app.delete('/user/:id', { preHandler: [authenticate] }, deleteUserController)
    app.post('/user', { schema: { body: userJsonSchema } }, postCreatUserController);
    app.post('/login', { schema: { body: loginJsonSchema } }, postAcessLoginController);

}
