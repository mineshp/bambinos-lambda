import { StackContext, Api, Config, Function } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const GH_P_ACCESS_TOKEN = new Config.Secret(stack, 'GH_P_ACCESS_TOKEN');
  const JWT_SECRET = new Config.Secret(stack, 'JWT_SECRET');

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        timeout: 20,
        bind: [JWT_SECRET, GH_P_ACCESS_TOKEN],
      },
    },
    routes: {
      'POST /': 'packages/functions/src/github.handler',
    },
  });

  const myLambdaFunction = new Function(stack, 'MyLambdaFunction', {
    handler: 'packages/functions/src/github.handler',
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
