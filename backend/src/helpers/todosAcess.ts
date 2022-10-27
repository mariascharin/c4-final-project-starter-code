import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk-core'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';

//const logger = createLogger('TodosAccess')

//const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all TodoItems')

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todoUpdate: TodoUpdate): Promise<TodoUpdate> {
    // TodoUpdate:
    // todoId: string
    // dueDate: string
    // done: boolean
    const { todoId, name, dueDate, done } = todoUpdate
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set #dueDate = :dueDate, #done = :done, #name = :name",
      ExpressionAttributeValues: {
        ":dueDate": dueDate,
        ":done": done,
        ":name": name,
      },
    };

    await this.docClient.update(params).promise()

    return todoUpdate
  }

  async deleteTodo(todoId: string): Promise<void> {

    const params = {
      TableName: this.todosTable,
      Key: {
        todoId
      },
    };
    
    try {
      await this.docClient.delete(params).promise()
      console.log(`Success - todoId ${todoId} deleted`);
    } catch (err) {
      console.log("Error", err);
    }
  }
}

/*function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}*/