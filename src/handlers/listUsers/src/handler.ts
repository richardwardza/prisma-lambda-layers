import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { users } from '/opt/nodejs/prismaLayer';

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userList = await users();

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: `${JSON.stringify(userList, null, 4)}`,
    }),
  });
};
