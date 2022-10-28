import { TodosAccess } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { createAttachmentPresignedUrl } from '../helpers/attachmentUtils'
//import { createLogger } from '../utils/logger'
//import * as createError from 'http-errors'

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
  return returnedTodo
}

export async function updateTodo(
    todoId: string, todoUpdate: UpdateTodoRequest
): Promise<void> {
  return await todosAccess.updateTodo(todoId, todoUpdate)
}

export async function generatePresignedAttachmentUrl(
  todoId: string
): Promise<string> {
  todosAccess.updateAttachmentUrl(todoId)
  return await createAttachmentPresignedUrl(todoId)
}

export async function deleteTodo(
  todoId: string
): Promise<void> {
  return await todosAccess.deleteTodo(todoId)
}
