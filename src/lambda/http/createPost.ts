import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { formatJSONResponse } from '../../utils/api-gateway'
import { getUserId } from '../utils';
import { postService } from '../../services'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createPost')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newPost: CreatePostRequest = JSON.parse(event.body)
      const jwtToken = getUserId(event);
      logger.info('Creating new post');  
      const newItem = await postService.createPost(newPost, jwtToken); 
      logger.info('New post created :', { post : newItem }); 
      const response = { item: newItem }; 
      return formatJSONResponse(response, 201);
    } catch (error: any) {
      logger.error('Creating new post failed' , { error });  
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
