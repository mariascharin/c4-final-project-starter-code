import { TodosAccess } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { createAttachmentPresignedUrl } from '../helpers/attachmentUtils'
import { createLogger } from '../utils/logger'

const logger = createLogger('helpers/todo')
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
    todoId: string, todoUpdate: UpdateTodoRequest
): Promise<void> {
  const updatedTodo = await todosAccess.updateTodo(todoId, todoUpdate)
  logger.info('TODO was updated', { updatedTodo })
  return updatedTodo
}

export async function generatePresignedAttachmentUrl(
  todoId: string
): Promise<string> {
  todosAccess.updateAttachmentUrl(todoId)
  const presignedUrl = await createAttachmentPresignedUrl(todoId)
  logger.info('Presigned URL was created')
  return presignedUrl
}

export async function deleteTodo(
  todoId: string
): Promise<void> {
  await todosAccess.deleteTodo(todoId)
  logger.info('TODO was deleted', { todoId })
}
