import path from 'path';
import express from 'express';
import { execute } from 'lambda-local';

const app = express();

type Result = {
  statusCode?: number;
  headers?: { [k: string]: string };
  body?: string;
};
app.use(express.json());

const lambdaPath = path.join(__dirname, '/handler');

app.post('/user', async (req: any, res: any) => {
  try {
    console.log('RB: ', req.body);
    const result = (await execute({
      lambdaPath,
      lambdaHandler: 'default',
      envfile: path.join(__dirname, '.env'),
      event: {
        headers: req.headers, // Pass on request headers
        body: JSON.stringify(req.body), // Pass on request body
        pathParameters: req.params,
      },
    })) as Result;

    // Respond to HTTP request
    return res.status(result.statusCode).set(result.headers).send(JSON.parse(result.body));
  } catch (err) {
    console.log('Lambda error: ', err);
    return res.status(500).end('internal error');
  }
});

app.listen(3000, () => console.log('listening on port: 3000'));
