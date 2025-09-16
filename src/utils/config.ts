export const config = {
  users: {
    valid: {
      username: process.env.GITHUB_USERNAME || 'your_username',
      email: process.env.GITHUB_EMAIL || 'your_email@example.com',
      password: process.env.GITHUB_PASSWORD || 'your_password'
    },
    invalid: {
      username: 'invalid_username',
      email: 'invalid_email@example.com',
      password: 'invalid_password'
    }
  },
  urls: {
    login: 'https://github.com/login',
    home: 'https://github.com/',
    password_reset: 'https://github.com/password_reset',
    logout: 'https://github.com/logout',
    create_account: 'https://github.com/signup',
    terms: 'https://docs.github.com/site-policy/github-terms/github-terms-of-service',
    privacy: 'https://docs.github.com/site-policy/privacy-policies/github-privacy-statement',
    docs: 'https://docs.github.com/',
    support: 'https://support.github.com/',
    request: 'https://support.github.com/request/landing'
  },
  api: {
    baseUrl: 'https://api.github.com',
    token: process.env.GITHUB_API_TOKEN || '',
    owner: process.env.GITHUB_REPO_OWNER || '',
    repo: process.env.GITHUB_REPO_NAME || ''
  },
  testData: {
    issueTitle: 'Test Issue Title',
    issueBody: 'Test Issue Body',
    emptyIssueTitle: '',
    longIssueTitle: 'A'.repeat(300),
    sqlInjection: "' OR '1'='1'; --",
    xssPayload: "<script>alert('XSS')</script>",
    malformedEmails: ['userexample.com', 'user@', 'user@example']
  },
};