import type { WorkflowPair } from './types.js';

function contentText(data: any): string | null {
  if (!data || Array.isArray(data) || data.type !== 'file' || typeof data.content !== 'string') return null;
  return Buffer.from(data.content, data.encoding ?? 'base64').toString('utf8');
}

export async function getFileText(
  octokit: any,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string | null> {
  try {
    const response = await octokit.rest.repos.getContent({ owner, repo, path, ref });
    return contentText(response.data);
  } catch (error: any) {
    if (error?.status === 404) return null;
    throw error;
  }
}

export async function changedWorkflowPairs(
  octokit: any,
  owner: string,
  repo: string,
  pullNumber: number,
  baseSha: string,
  headSha: string
): Promise<WorkflowPair[]> {
  const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
    owner, repo, pull_number: pullNumber, per_page: 100
  });
  const workflowFiles = files.filter((file: any) =>
    (file.filename.startsWith('.github/workflows/') && /\.ya?ml$/i.test(file.filename)) ||
    (typeof file.previous_filename === 'string' && file.previous_filename.startsWith('.github/workflows/') && /\.ya?ml$/i.test(file.previous_filename))
  );

  return Promise.all(workflowFiles.map(async (file: any) => {
    const headPath = file.filename;
    const basePath = file.status === 'renamed' && file.previous_filename ? file.previous_filename : file.filename;
    const [baseText, headText] = await Promise.all([
      file.status === 'added' ? Promise.resolve(null) : getFileText(octokit, owner, repo, basePath, baseSha),
      file.status === 'removed' ? Promise.resolve(null) : getFileText(octokit, owner, repo, headPath, headSha)
    ]);
    return { path: headPath, baseText, headText };
  }));
}

export async function upsertPullRequestComment(
  octokit: any,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string,
  marker: string
): Promise<void> {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner, repo, issue_number: pullNumber, per_page: 100
  });
  const existing = comments.find((comment: any) => typeof comment.body === 'string' && comment.body.includes(marker));
  if (existing) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: pullNumber, body });
  }
}
