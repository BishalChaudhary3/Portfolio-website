// lib/github.js
const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Fetch with authentication
async function githubFetch(endpoint) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }
  
  return await response.json();
}

// Get user profile
export async function getGitHubUser(username) {
  try {
    const user = await githubFetch(`/users/${username}`);
    return {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      location: user.location,
      blog: user.blog,
      twitter: user.twitter_username,
      company: user.company,
      createdAt: user.created_at,
    };
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

// Get user repositories
export async function getGitHubRepos(username, options = {}) {
  try {
    const { sort = 'updated', direction = 'desc', perPage = 30, page = 1 } = options;
    const repos = await githubFetch(
      `/users/${username}/repos?sort=${sort}&direction=${direction}&per_page=${perPage}&page=${page}`
    );
    
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      homepage: repo.homepage,
      topics: repo.topics,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

// Get repository details
export async function getGitHubRepoDetails(username, repoName) {
  try {
    const repo = await githubFetch(`/repos/${username}/${repoName}`);
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      language: repo.language,
      license: repo.license?.name,
      topics: repo.topics,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage,
      openIssues: repo.open_issues_count,
      defaultBranch: repo.default_branch,
    };
  } catch (error) {
    console.error('Error fetching repo details:', error);
    return null;
  }
}

// Get starred repositories
export async function getStarredRepos(username, perPage = 30) {
  try {
    const starred = await githubFetch(`/users/${username}/starred?per_page=${perPage}`);
    return starred.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
    }));
  } catch (error) {
    console.error('Error fetching starred repos:', error);
    return [];
  }
}

// Get contribution activity (heatmap data)
export async function getContributionActivity(username) {
  try {
    const events = await githubFetch(`/users/${username}/events/public?per_page=100`);
    
    // Group by date
    const contributions = {};
    events.forEach(event => {
      const date = event.created_at.split('T')[0];
      if (event.type === 'PushEvent' || event.type === 'CreateEvent') {
        contributions[date] = (contributions[date] || 0) + 1;
      }
    });
    
    return Object.entries(contributions).map(([date, count]) => ({ date, count }));
  } catch (error) {
    console.error('Error fetching contribution activity:', error);
    return [];
  }
}

// Get language statistics
export async function getLanguageStats(username) {
  try {
    const repos = await getGitHubRepos(username, { perPage: 100 });
    const languages = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    
    // Sort by count
    const sorted = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count, percentage: (count / repos.length) * 100 }));
    
    return sorted;
  } catch (error) {
    console.error('Error fetching language stats:', error);
    return [];
  }
}

// Get overall stats summary
export async function getGitHubStats(username) {
  try {
    const [user, repos] = await Promise.all([
      getGitHubUser(username),
      getGitHubRepos(username, { perPage: 100 }),
    ]);
    
    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
    const languages = await getLanguageStats(username);
    
    return {
      user,
      totalRepos: repos.length,
      totalStars,
      totalForks,
      languages,
      topRepos: repos.sort((a, b) => b.stars - a.stars).slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}