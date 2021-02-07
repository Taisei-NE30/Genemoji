import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import AWS from 'aws-sdk'
import { middyfy } from '@libs/lambda';
import { registerFont } from 'canvas';
import schema from './schema';

const imageWidth = 128
const imageHeight = 128

const generateEmoji: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const s3 = new AWS.S3()
  s3.getObject({
    Bucket: 'genemoji-fonts',
    Key: 'NotoSansMonoCJKJP_Bold.ttf'
  }, (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    registerFont(data.Body.toString(),  {
      family: 'Noto Sans JP',
      weight: 'bold'
    })
  })

  return formatJSONResponse({
    message: "OK"
  });
}

const sparateText = (text: string): string[] => {
  const lineMax = 5

  const textLength = text.length
  if (textLength < 4) {
    return [text]
  }

  let linesNum = 2
  let lineLength: number
  while (true) {
    lineLength = (textLength + linesNum - 1) / linesNum
    if (lineLength > lineMax) {
      linesNum++
    } else {
      break
    }
  }

  let start = 0
  let end = lineLength

  const separatedText = new Array(linesNum).fill(null).map(() => {
    const result = text.slice(start, end)
    start = end
    end += lineLength
    return result
  })

  return separatedText
}

export const main = middyfy(generateEmoji)
