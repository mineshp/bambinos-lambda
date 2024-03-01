import { StackContext, Api } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const api = new Api(stack, 'api', {
    defaults: {},
    routes: {
      'GET /': 'packages/functions/src/helloworld.handler',
      // 'GET /': 'packages/functions/src/lambda.handler',
      'GET /todo': 'packages/functions/src/todo.list',
      'POST /todo': 'packages/functions/src/todo.create',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
