import jwt from 'jsonwebtoken';
import { ApiHandler } from 'sst/node/api';

export const handler = ApiHandler(async (event) => {
  const { workflowRunId } = event.body ? JSON.parse(event.body) : null;
  const authToken = event.headers['Authorization']?.split(' ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  console.log('MINESH');
  console.log(jwtSecret);
  const decodedToken = jwt.verify(authToken, jwtSecret);
  console.log(decodedToken);

  if (
    decodedToken.clientId !== 'slack' &&
    decodedToken.server !== 'BambinosStory' &&
    decodedToken.repo !== 'bambinos-story-v2'
  ) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const ghAccessToken = process.env.GH_P_ACCESS_TOKEN;
  const repo = 'bambinos-story-v2';
  const ghApiRerunEndpoint = `https://api.github.com/repos/mpatel/${repo}/actions/runs/${workflowRunId}/rerun`;

  try {
    const response = await fetch(ghApiRerunEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${ghAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger workflow ${workflowRunId} rerun`);
    }

    console.log(`Workflow rerun for ${workflowRunId} triggered successfully`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        action: 'success',
      }),
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Internal Server Error attepting to rerun workflow ${workflowRunId}`,
      }),
    };
  }
});
