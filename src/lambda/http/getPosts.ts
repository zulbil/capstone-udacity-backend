import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { formatJSONResponse } from '../../utils/api-gateway'
import { getUserId } from '../utils'
import { postService } from '../../services'

const logger = createLogger('getPosts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId = getUserId(event);
      const posts = await postService.getPosts(userId);
      logger.info('Get Posts API from DynamoDB Table', { posts });      
      const response = { items : posts };
      return formatJSONResponse(response);
    } catch (error: any) {
      logger.error('Get Posts failed' , { error });  
      return formatJSONResponse({
        message: error.message
      }, 500)
    }
  }  
)

handler.use(
  cors({
    credentials: true
  })
)
