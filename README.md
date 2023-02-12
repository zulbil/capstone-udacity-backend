# CAPSTONE UDACITY

# Functionality of the application

This application will allow creating/removing/updating/fetching Post items. Each post item can optionally have an attachment image. Each user only has access to post items that he/she has created.

# POST items

The application should store post items, and each post item contains the following fields:

* `postId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `message` (string) - message of a post item (e.g. "Change a light bulb")
* `updatedAt` (string) - date and time when an item was created
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a post item
* `userId` (string) - User id who create the post item

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetPosts` - should return all posts for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
    "items": [
        {
            "attachmentUrl": "https://post-app-images-dev.s3.amazonaws.com/8bed66e5-f958-4979-8466-f26b4c07e9bd",
            "updatedAt": "2023-02-12T01:26:21.865Z",
            "userId": "google-oauth2|109305892403981469909",
            "createdAt": "2023-02-12T01:26:21.865Z",
            "message": "I love the room. Beautifull mastress by the way. plus jgjkbjkh ",
            "postId": "8bed66e5-f958-4979-8466-f26b4c07e9bd"
        },
        {
            "attachmentUrl": "https://post-app-images-dev.s3.amazonaws.com/4a5e4205-3388-4f69-b799-c80ca8cea94a",
            "userId": "google-oauth2|109305892403981469909",
            "updatedAt": "2023-02-12T04:20:10.662Z",
            "createdAt": "2023-02-12T04:20:10.662Z",
            "message": "PC in the bag",
            "postId": "4a5e4205-3388-4f69-b799-c80ca8cea94a"
        }
    ]
}
```

* `CreatePost` - should create a new post for a current user. A shape of data send by a client application to this function can be found in the `CreatePostRequest.ts` file

It receives a new Post item to be created in JSON format that looks like this:

```json
 {
    "attachmentUrl": "",
    "userId": "google-oauth2|109305892403981469909",
    "updatedAt": "2023-02-12T04:12:41.890Z",
    "createdAt": "2023-02-12T04:12:41.890Z",
    "message": "Creative a blog in cloud development with Node.JS with chatGTP",
    "postId": "ef8e4615-7a6b-4f79-be45-b63d5c0fabfd"
},
```

It should return a new Post item that looks like this:

```json
{
    "item":  {
        "attachmentUrl": "",
        "userId": "google-oauth2|109305892403981469909",
        "updatedAt": "2023-02-12T04:12:41.890Z",
        "createdAt": "2023-02-12T04:12:41.890Z",
        "message": "Creative a blog in cloud development with Node.JS with chatGTP",
        "postId": "ef8e4615-7a6b-4f79-be45-b63d5c0fabfd"
    },
}
```

* `UpdatePost` - should update a post item created by a current user. A shape of data send by a client application to this function can be found in the `UpdatePostRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
    "message": "Creative a blog in cloud development with Node.JS with chatGTP 1.35"
}
```

It should return a new Post item that looks like this:

```json
{
    "item":  {
        "attachmentUrl": "",
        "userId": "google-oauth2|109305892403981469909",
        "updatedAt": "2023-02-12T04:12:41.890Z",
        "createdAt": "2023-02-12T04:12:41.890Z",
        "message": "Creative a blog in cloud development with Node.JS with chatGTP 1.35",
        "postId": "ef8e4615-7a6b-4f79-be45-b63d5c0fabfd"
    },
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeletePost` - should delete a post item created by a current user. Expects an id of a post item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a post item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

Here is the front end project (https://github.com/zulbil/capstone-udacity-frontend)

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

- Click on the import button
- Click on the "Choose Files"
- Select a file to import "Capstone-Project.postman_collection.json" in the project
- Right click on the imported collection to set variables for the collection:
- Provide variables for the collection (similarly to how this was done in the course)
