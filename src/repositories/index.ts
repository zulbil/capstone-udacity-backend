import dynamoDBClient from "./database";
import PostRepository from "./PostRepository";

export const postRepository = new PostRepository(dynamoDBClient());