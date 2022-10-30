import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer/TodosAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.TODOS_CREATED_BY_INDEX) {
  }

  async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
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
      logger.info('TODOs were fetched')
      return items as TodoItem[]
    } catch (err) {
      logger.error('Problem occurred when fetching TODOs', { err })
    }
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      Item: todo
    }

    try {
      await this.docClient.put(params).promise()
      logger.info('TODO was updated', { todo })
    } catch (err) {
      logger.error('Problem occurred when creating TODO', { err })
    }
    return todo
  }

  async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<void> {
    const { name, dueDate, done } = todoUpdate
    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
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
      logger.info('TODO was updated', { todoId })
    } catch (err) {
      logger.info('Problem occurred when updating TODO', { err })
    }
    return null
  }

  async updateAttachmentUrl(userId:string, todoId: string): Promise<void> {
    const bucketName = process.env.ATTACHMENT_S3_BUCKET
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
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
      logger.info('Attachment URL was updated', { todoId })
    } catch (err) {
      logger.error('Problem occurred when updating attachment URL', { err })
    }
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {

    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
    };
    
    try {
      await this.docClient.delete(params).promise()
      logger.info('TODO was deleted', { todoId })
    } catch (err) {
      logger.error('Problem occurred when deleting TODO', { err })
    }

    return null
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}