import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';
import { formatJSONResponse } from '../../utils/api-gateway'
import { postService } from '../../services'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deletePost')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.postId;
      const userId = getUserId(event);
      logger.info('Deleting Post with Id', {id: todoId}); 
      await postService.deletePost(todoId, userId);
      logger.info('Post deleted with Id', {id: todoId}); 
      return formatJSONResponse(null, 204);

    } catch (error: any) {
      logger.error('Deleting post failed ', {error}); 
      return formatJSONResponse({
        message: error.message
      }, 500)
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
