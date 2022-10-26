// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '43231yd0o6'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-i8yh1dwosg76yw4r.us.auth0.com',
  clientId: 'z7hcrilewh5LOe51xlrTOrLdF2ucuCVF',
  callbackUrl: 'http://localhost:3000/callback'
}
