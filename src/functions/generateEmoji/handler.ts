import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/apiGateway';
import AWS from 'aws-sdk'
import { middyfy } from '../../libs/lambda';
import { createCanvas, CanvasRenderingContext2D, registerFont } from 'canvas';
import schema from './schema';

const imageWidth = 128
const imageHeight = 128

type fontFace = {
  family: string,
  weight?: string,
  px: number
}

const defaultFontInfo: fontFace = {
  family: 'Noto Sans JP',
  weight: 'bold',
  px: 1
}

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
    registerFont(data.Body.toString(), {
      family: defaultFontInfo.family,
      weight: defaultFontInfo.weight
    })
  })

  const canvas = createCanvas(imageWidth, imageHeight)
  const ctx = canvas.getContext('2d')
  const texts = separateText(event.body.text)
  decisionFontInfo(ctx, event.body.text, imageHeight / texts.length)

  return formatJSONResponse({
    message: "OK"
  });
}

export const separateText = (text: string): string[] => {
  const lineMax = 5

  const textLength = text.length
  if (textLength < 4) {
    return [text]
  }

  let linesNum = 1
  let lineLength: number
  do {
    linesNum++
    lineLength = Math.ceil(textLength / linesNum)
  } while (lineLength > lineMax)

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

const decisionFontInfo = (ctx: CanvasRenderingContext2D, text: string, lineHeight: number): fontFace => {
  const fontInfo = defaultFontInfo
  ctx.font = `${fontInfo.family} ${fontInfo.px}px`

  let prevFontSize = 0.0
  let [width, height] = calcFontSize(ctx, text)
  while (width < imageWidth && height < lineHeight) {
    prevFontSize = fontInfo.px
    fontInfo.px += 0.5
    ctx.font = `${fontInfo.family} ${fontInfo.px}px`;
    [width, height] = calcFontSize(ctx, text)
  }

  ctx.font = `${fontInfo.family} ${prevFontSize}px`
  return fontInfo
}

const calcFontSize = (ctx: CanvasRenderingContext2D, text: string): number[] => {
  const textMetrics = ctx.measureText(text)
  const width = Math.abs(textMetrics.actualBoundingBoxLeft) +
    Math.abs(textMetrics.actualBoundingBoxRight)
  const height = Math.abs(textMetrics.actualBoundingBoxAscent) + 
    Math.abs(textMetrics.actualBoundingBoxDescent)
  return [width, height]
}

export const main = middyfy(generateEmoji)
