import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const generateEmoji: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

}

export const main = middyfy(generateEmoji)
