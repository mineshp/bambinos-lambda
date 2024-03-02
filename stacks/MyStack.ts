import { StackContext, Api, Config, Function } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const GH_P_ACCESS_TOKEN = new Config.Secret(stack, 'GH_P_ACCESS_TOKEN');

  const api = new Api(stack, 'api', {
    defaults: {},
    routes: {
      'POST /': 'packages/functions/src/github.handler',
    },
  });

  const myLambdaFunction = new Function(stack, 'MyLambdaFunction', {
    handler: 'packages/functions/src/github.handler',
    environment: {
      GH_P_ACCESS_TOKEN: GH_P_ACCESS_TOKEN.toString(),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
