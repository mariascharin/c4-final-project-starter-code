import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodosForUser } from '../../helpers/todos'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils';

// Get all TODO items for the current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId: string = getUserId(event)
    const items: TodoItem[] = await getAllTodosForUser(userId)
    console.log('items ', items);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
