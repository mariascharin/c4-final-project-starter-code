import * as AWS from 'aws-sdk'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export function createAttachmentPresignedUrl(imageId: string) {

    const bucketName = process.env.ATTACHMENT_S3_BUCKET
    const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: urlExpiration
    })
}