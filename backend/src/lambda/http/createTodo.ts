import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { TodoItem } from '../../models/TodoItem'

// Create a TODO item
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)

    const todoItem: TodoItem = await createTodo(userId, newTodo)
    console.log('todoItem ', todoItem);

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: todoItem
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
