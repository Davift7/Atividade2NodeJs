//importação de dependencias necessárias
import { FastifyInstance } from 'fastify';
//Importação de utilits
import { authenticate } from '../utils/auth';
//Importação de controllers
import { 
  postCreatePostController, 
  getPostController, 
  deletePostController, 
  patchAttPostController, 
  getPostIdController, 
  getLikesByPostController, 
  getcommentsByPostController 
} from '../controllers/post-controller';

//Puxando os JSON Schemas do main-schemas
import { postJsonSchema, postUpdateJsonSchema } from '../schemas/main-schemas';

export async function postRoutes(app: FastifyInstance) {
  app.post(
    '/post', 
    { preHandler: [authenticate], schema: { body: postJsonSchema } }, 
    postCreatePostController
  );

  app.get('/posts', getPostController);

  app.delete(
    '/post/:id', 
    { preHandler: [authenticate] }, 
    deletePostController
  );

  app.patch(
    '/post/:id', 
    { preHandler: [authenticate], schema: { body: postUpdateJsonSchema } }, 
    patchAttPostController
  );

  app.get('/post/:id', getPostIdController);

  app.get('/post/:postId/likes', getLikesByPostController);

  app.get('/post/:postId/comments', getcommentsByPostController);
}
