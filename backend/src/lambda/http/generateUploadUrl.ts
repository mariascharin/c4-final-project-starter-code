import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { generatePresignedAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// Return a presigned URL to upload a file for a TODO item with the provided id
// Each TODO item can have exactly one image, thus we can use todoId as imageId
// Update TODO item with attachmentUrl
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const userId: string = getUserId(event)
    const todoId = event.pathParameters.todoId
    // Each TODO item can 
    const uploadUrl = await generatePresignedAttachmentUrl(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
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
