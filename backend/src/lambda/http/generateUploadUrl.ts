import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/attachmentUtils'
import { updateImageUrl } from '../../helpers/todos'
//import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    // also update todoId item with imageId and imageUrl (https://${bucketName}.s3.amazonaws.com/${imageId})
    
    console.log('generateUploadUrl function, event: ', event)
    
    const todoId = event.pathParameters.todoId
    const imageId = await updateImageUrl(todoId)
    const uploadUrl = await createAttachmentPresignedUrl(imageId)

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
