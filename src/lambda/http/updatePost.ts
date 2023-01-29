import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { formatJSONResponse } from '../../utils/api-gateway'
import { getUserId } from './../utils';
import { postService } from '../../services'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updatePost')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const postId = event.pathParameters.postId
      const updatedPost: UpdatePostRequest = JSON.parse(event.body)
      const userId = getUserId(event);
      logger.info('Updating Post with Id', {id : postId })
      const updatedItem = await postService.updatePost(postId, userId, updatedPost);
      const response = {
        item : updatedItem
      };
      logger.info('Post updated successfully with Id', {id : postId })
      return formatJSONResponse(response);
    } catch (error: any) {
      logger.error('Updating post failed', { error });  
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
