import jwt from 'jsonwebtoken';
import { ApiHandler } from 'sst/node/api';
import { Config } from 'sst/node/config';

export const handler = ApiHandler(async (event) => {
  const { workflowRunId } = event.body ? JSON.parse(event.body) : null;
  const authToken = event.headers['authorization']?.split(' ')[1];

  const jwtSecret = Config.JWT_SECRET;
  const decodedToken = jwt.verify(authToken, jwtSecret);

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

  const ghAccessToken = Config.GH_P_ACCESS_TOKEN;
  const repo = 'bambinos-story-v2';
  const ghApiRerunEndpoint = `https://api.github.com/repos/mpatel/${repo}/actions/runs/${workflowRunId}/rerun-failed-jobs`;

  try {
    const response = await fetch(ghApiRerunEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${ghAccessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
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
        error: `Internal Server Error attempting to rerun workflow ${workflowRunId}`,
      }),
    };
  }
});
