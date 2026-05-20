// app/api/github/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/users/yourusername/repos', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      throw new Error('GitHub API error');
    }
    
    const repos = await response.json();
    
    const stats = {
      totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      totalForks: repos.reduce((acc, repo) => acc + repo.forks_count, 0),
      totalRepos: repos.length,
      topRepos: repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(repo => ({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          description: repo.description,
        })),
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}