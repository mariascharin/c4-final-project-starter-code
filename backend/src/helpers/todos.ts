//import { TodosAccess } from '../dataLayer/todosAccess'
import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
//import { getUserId } from '../auth/jwtUtils';
//import { TodoUpdate } from '../models/TodoUpdate';

const todosAccess = new TodosAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return await todosAccess.getAllTodos()
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  //const userId = getUserId(jwtToken)
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const { name, dueDate } = createTodoRequest
  const done = false
  const todo = {
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
  //const userId = getUserId(jwtToken)
  
  return await todosAccess.updateTodo(todoId, todoUpdate)
}

export async function updateImageUrl(
  todoId: string
): Promise<string> {
  const imageId = uuid.v4()
  await todosAccess.updateImageUrl(todoId, imageId)
  return imageId
}

export async function deleteTodo(
  todoId: string
): Promise<void> {
  return await todosAccess.deleteTodo(todoId)
}
