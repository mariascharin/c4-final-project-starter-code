import * as uuid from 'uuid'
import { createAttachmentPresignedUrl } from '../dataLayer/attachmentUtils'
import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/todo')
const todosAccess = new TodosAccess()

export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getAllTodosForUser(userId)
}

export async function createTodo(
    userId: string, createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const { name, dueDate } = createTodoRequest
  const done = false
  const todo = {
    userId,
    todoId,
    createdAt,
    name,
    dueDate,
    done,
  }
  const returnedTodo = await todosAccess.createTodo(todo)
  logger.info('TODO was created', { returnedTodo })
  return returnedTodo
}

export async function updateTodo(
  userId: string, todoId: string, todoUpdate: UpdateTodoRequest
): Promise<void> {
  const updatedTodo = await todosAccess.updateTodo(userId, todoId, todoUpdate)
  logger.info('TODO was updated', { updatedTodo })
  return updatedTodo
}

export async function generatePresignedAttachmentUrl(
  userId: string, todoId: string
): Promise<string> {
  todosAccess.updateAttachmentUrl(userId, todoId)
  const presignedUrl = await createAttachmentPresignedUrl(todoId)
  logger.info('Presigned URL was created')
  return presignedUrl
}

export async function deleteTodo(
  userId: string, todoId: string
): Promise<void> {
  await todosAccess.deleteTodo(userId, todoId)
  logger.info('TODO was deleted', { todoId })
}
