import { StackContext, Api, Config, Function } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const GH_P_ACCESS_TOKEN = new Config.Secret(stack, 'GH_P_ACCESS_TOKEN');
  const JWT_SECRET = new Config.Secret(stack, 'JWT_SECRET');

  const api = new Api(stack, 'api', {
    defaults: {},
    routes: {
      'POST /': 'packages/functions/src/github.handler',
    },
  });

  console.log(JWT_SECRET.toString());

  const myLambdaFunction = new Function(stack, 'MyLambdaFunction', {
    handler: 'packages/functions/src/github.handler',
    bind: [JWT_SECRET, GH_P_ACCESS_TOKEN],
    environment: {
      GH_P_ACCESS_TOKEN: GH_P_ACCESS_TOKEN.toString(),
      JWT_SECRET: JWT_SECRET.toString(),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
