import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import AWS from 'aws-sdk'
import { middyfy } from '@libs/lambda';
import { registerFont } from 'canvas';
import schema from './schema';

const generateEmoji: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const s3 = new AWS.S3()
  const response = s3.getObject({
    Bucket: 'genemoji-fonts',
    Key: 'NotoSansMonoCJKJP_Bold.ttf'
  }, (err, data) => {
    if (err) {
      console.error(err)
    }
    registerFont(data.Body.toString(),  {
      family: 'Noto Sans JP'
    })
  })

  return formatJSONResponse({

  });
}

export const main = middyfy(generateEmoji)
