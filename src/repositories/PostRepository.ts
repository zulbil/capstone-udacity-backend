import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PostItem } from '../models/PostItem'
import { PostUpdate } from "../models/PostUpdate";
//import { PostUpdate } from '../models/PostUpdate';
import { createLogger } from "../utils/logger";

export default class PostRepository {
    private postsTable: string           =  process.env.POSTS_TABLE;
    private indexName: string            =  process.env.POSTS_CREATED_AT_INDEX; 
    private logger: any                  =  createLogger('PostRepository'); 

    constructor(private docClient: DocumentClient) {}

    async getPosts(userId: string): Promise<PostItem[]> {
        this.logger.info('Performing query operation on post table index');
        const result = await this.docClient.query({
          TableName: this.postsTable,
          IndexName: this.indexName,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId' : userId
          }
        }).promise();
    
        const items = result.Items
    
        return items as PostItem[]
    }

    async getPost(userId: string, postId: string): Promise<PostItem> {
      this.logger.info('Performing query operation on post table index');
      const result = await this.docClient.query({
        TableName: this.postsTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId, postId = :postId',
        ExpressionAttributeValues: {
          ':userId' : userId,
          ':postId' : postId
        }
      }).promise();
  
      const item = result.Items[0]
  
      return item as PostItem
  }
    
    async createPost(post: PostItem): Promise<PostItem> {
      this.logger.info('Performing put operation on post table');
      await this.docClient.put({
        TableName: this.postsTable,
        Item: post
      }).promise()
  
      return post;
    }
    
    async updatePost(postId: string, userId: string, postItem: Partial<PostUpdate>): Promise<PostUpdate> {
      this.logger.info('Performing update operation on todo table');
      const updated = await this.docClient
          .update({
              TableName: this.postsTable,
              Key: { 
                userId,
                postId 
              },
              UpdateExpression:
                  "set #attachmentUrl = :attachmentUrl",
              ExpressionAttributeNames: {
                  "#attachmentUrl": "attachmentUrl"
              },
              ExpressionAttributeValues: {
                  ":attachmentUrl": postItem.attachmentUrl
              },
              ReturnValues: "ALL_NEW",
          })
          .promise();
      return updated.Attributes as PostUpdate;
    }

    async updatePostAttachment(postId: string, userId: string, attachmentUrl: string): Promise<any> {
      this.logger.info('Performing update attachment operation on posts table');
      const updated = await this.docClient
          .update({
              TableName: this.postsTable,
              Key: { userId, postId },
              UpdateExpression: "set #attachmentUrl = :attachmentUrl",
              ExpressionAttributeNames: { "#attachmentUrl": "attachmentUrl" },
              ExpressionAttributeValues: {
                  ":attachmentUrl": attachmentUrl
              },
              ReturnValues: "ALL_NEW",
          })
          .promise();
      return updated.Attributes as any;
    }
  
    async deletePost(postId: string, userId: string): Promise<any> {
      this.logger.info('Performing delete operation on post table');
        return await this.docClient.delete({
            TableName: this.postsTable,
            Key: { 
              userId,
              postId
            }
        }).promise();
    }
}