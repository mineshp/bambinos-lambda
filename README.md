# SST

## Packages/Core

This folder likely contains core functionality or utilities that are shared across your serverless application. These might include helper functions, custom middleware, or other common utilities.

## Packages/Functions

This folder seems to contain your Lambda functions. Each subfolder corresponds to a separate Lambda function, similar to the default "functions" folder in SST projects. Inside each function folder, you'll typically find an index.js file (or .ts if you're using TypeScript) with the function code and any other necessary files.

## Stacks

Your stacks folder contains stack definitions, similar to the default structure. Each stack definition file (like myStack.ts) defines the AWS resources for a specific part of your application. These resources could include Lambda functions, API Gateway endpoints, DynamoDB tables, etc.
