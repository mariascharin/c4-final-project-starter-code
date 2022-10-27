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
    updateTodoRequest: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
  //const userId = getUserId(jwtToken)
  const { todoId, name, dueDate, done } = updateTodoRequest
  const todoUpdate = {
    todoId,
    name,
    dueDate,
    done,
  }
  return await todosAccess.updateTodo(todoUpdate)
}

export async function deleteTodo(
  todoId: string
): Promise<void> {
  await todosAccess.deleteTodo(todoId)
  return null
}
