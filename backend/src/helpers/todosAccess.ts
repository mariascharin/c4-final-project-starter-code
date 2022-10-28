import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk-core'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
//import { createLogger } from '../utils/logger'

//const logger = createLogger('TodosAccess')

//const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.TODOS_CREATED_BY_INDEX) {
  }

  async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
    console.log('Getting all TodoItems')

    const params = {
      TableName : this.todosTable,
      IndexName : this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }

    try {
      const result = await this.docClient.query(params).promise()
      const items = result.Items
      return items as TodoItem[]
    } catch (err) {
      console.log("Error", err);
    }
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todoId: string, todoUpdate: TodoUpdate): Promise<void> {
    const { name, dueDate, done } = todoUpdate
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set #dueDate = :dueDate, #done = :done, #name = :name",
      ExpressionAttributeNames: {
          '#dueDate': 'dueDate',
          '#done': 'done',
          '#name': 'name',
      },
      ExpressionAttributeValues: {
        ":dueDate": dueDate,
        ":done": done,
        ":name": name,
      },
    };

    try {
      await this.docClient.update(params).promise()
      console.log(`Success - todoId ${todoId} updated`);
    } catch (err) {
      console.log("Error", err);
    }

    return null
  }

  async updateAttachmentUrl(todoId: string): Promise<void> {
    const bucketName = process.env.ATTACHMENT_S3_BUCKET
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set #attachmentUrl = :attachmentUrl",
      ExpressionAttributeNames: {
          '#attachmentUrl': 'attachmentUrl',
      },
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl,
      },
    };

    try {
      await this.docClient.update(params).promise()
      console.log(`Success - attachmentUrl updated for ${todoId}`);
    } catch (err) {
      console.log("Error", err);
    }
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

    return null
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