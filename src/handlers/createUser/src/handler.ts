import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { add } from '/opt/nodejs/libLayer';
import { createUser } from '/opt/nodejs/prismaLayer';
import { CreateUserData } from '@shared/types/user';

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const num1 = 16;
  const num2 = 4;
  const sum = add(num1, num2);

  const { name, email }: CreateUserData = JSON.parse(event.body);
  const user = await createUser({
    name,
    email,
  });

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: `${num1} yyyy+ ${num2} = ${sum} ${JSON.stringify(user, null, 4)}`,
    }),
  });
};
