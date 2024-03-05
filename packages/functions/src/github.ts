import jwt from 'jsonwebtoken';
import { Octokit } from 'octokit';
import { ApiHandler } from 'sst/node/api';
import { Config } from 'sst/node/config';

export const handler = ApiHandler(async (event) => {
  const { workflowRunId } = event.body ? JSON.parse(event.body) : null;
  const authToken: string | undefined =
    event.headers['authorization']?.split(' ')[1];

  const jwtSecret = Config.JWT_SECRET;
  const decodedToken: any = jwt.verify(authToken as string, jwtSecret);

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
  const rerunEndpoint = `https://api.github.com/repos/mineshp/${repo}/actions/runs/${workflowRunId}/rerun-failed-jobs`;

  try {
    const octokit = new Octokit({
      auth: ghAccessToken,
    });

    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs',
      {
        owner: 'mineshp',
        repo,
        run_id: workflowRunId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'user-agent': 'bambinos-lambda',
        },
      }
    );

    if (response.status !== 201) {
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
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Internal Server Error attempting to rerun workflow ${workflowRunId}`,
      }),
    };
  }
});
