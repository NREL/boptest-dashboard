# BOPTest Dashboard

### Docker

This site is developed and deployed using [Docker](https://www.docker.com/). To set up a development environment:

1. Clone this repoistory.
2. [Download](https://www.docker.com/products/overview) and install Docker.
3. Start the docker service on your machine.

### Auth

This application uses OAuth authentication with Google and GitHub. This approach provides secure authentication without storing personally identifiable information (PII). Instead, we store a hashed identifier derived from the OAuth provider's user ID.

#### OAuth Setup

To set up OAuth authentication:

1. **Google OAuth Setup**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" and select "OAuth client ID"
   - Select "Web application" as the application type
   - Add a name for your OAuth client
   - Add authorized JavaScript origins: `http://localhost:8080` (or your production URL)
   - Add authorized redirect URIs: `http://localhost:8080/api/auth/google/callback` (or your production URL)
   - Click "Create" to get your client ID and client secret
   - Update the `.env` file with these credentials

2. **GitHub OAuth Setup**:
   - Go to your [GitHub account settings](https://github.com/settings/profile)
   - Navigate to "Developer settings" → "OAuth Apps"
   - Click "New OAuth App"
   - Add an application name
   - Add a homepage URL (e.g., `http://localhost:8080`)
   - Add an authorization callback URL: `http://localhost:8080/api/auth/github/callback`
   - Click "Register application" to get your client ID and client secret
   - Update the `.env` file with these credentials

3. **Update Environment Variables**:
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your Google OAuth credentials
   - Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` with your GitHub OAuth credentials
   - Set `CALLBACK_URL_BASE` to your application's base URL (default is `http://localhost:8080`)
   - Set `IDENTIFIER_SALT` to a secure random string (used for hashing identifiers)

#### Privacy Note

This authentication system is designed with privacy in mind:
- No emails or personal information are stored in the database
- User identifiers are hashed with a salt to prevent tracking
- Only display names (which users can customize) are stored

#### Auth Scaling Note

If it is ever needed to scale and deploy in multiple instances with load balancers then we will need to tweak the way that we handle sessions since we're currently storing them in memory.

### Environment Variables

Copy the file `/pg/database.env.configure-me` to `/pg/database.env`

```bash
cp /pg/database.env.configure-me /pg/database.env
```

Open that file and choose solid credentials for your db server.
You will need to choose a username, a [strong password](https://www.random.org/passwords/), and a sensible name for the db.

Copy the file `/server/.env.configure-me` to `/server/.env`

```bash
cp /server/.env.configure-me /server/.env
```

Open that file and fill in your OAuth credentials for Google and GitHub as described in the Auth section. Then choose a unique and memorable session name, and a secure [session secret](https://randomkeygen.com/).

The `SUPER_USERS` environment variable is a comma-separated list of hashed identifiers that gain administrative permissions within the app. Since we no longer store email addresses, you'll need to get the hashed identifier for a user after they've logged in. You can find this in the database or server logs.

Example:
`SUPER_USERS=abcdef1234567890,0987654321fedcba`

The `SUPER_USERS` have access to all routes in the app including ones that create/update building types, can post new results to the dashboard, etc.

### Launch Server

Open a terminal, cd to the directory you cloned the repo into

# Development

The entire app will build and run off a single docker-compose command:

```bash
docker-compose up
```

It'll take a while that first time, but that should be it. Any changes you make in the code should show up when you reload the site.

When you're done working on the site, do a `Ctrl-C` in the window with docker-compose running and then do:

```bash
docker-compose down
```

# Production

The entire app will build and be served via nginx with the following docker-compose command:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

To turn the servers off run the following docker-compose command:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

# Notes

To delete all volumes run the following docker command after either Dev or Prod down command:

```bash
docker system prune -a --volumes
```

To clear your local database after deleting all your volumes run the following command:

```bash
rm -rf pg/db_data
```

When you are done deleting your database be sure to log into AWS Cognito and delete user accounts associated with your database.

### Package Management

This application is developed entirely in Typescript with npm as the package manager. The app will need to be rebuilt if dependencies change due to the nature of how the containers are built with Docker. This can be done with a `docker-compose down` followed by removal of the images, and then a `docker-compose up` to rebuild the images with the new dependencies.

## Create Admin User

To create an admin user in the BOPTest dashboard an account must be created with the Register flow just like any other user, and then the email used for this new account must be added to the comma separated list environment variable of `SUPER_USERS`.

This user will then have elevated privileges to hit any production endpoint in the application.

### Testing

This application contains some integration testing to ensure the api endpoints are working as expected. They can be run with the following command.

```bash
docker-compose -f test-conf.yml down -v && \ 
docker-compose -f test-conf.yml run api_test &&  \ 
docker-compose -f test-conf.yml down -v
```

While this command is useful to just run and get the test results, sometimes something breaks and it is useful to dig in for more info. In this situation, the following command is useful:

```bash
docker-compose -f test-conf.yml down -v &&  \ 
docker-compose -f test-conf.yml up && 
```

Notice the `up` instead of `run` at the end. This shows output for all the containers and keeps them running until you kill the process. Because this command needs to stay running while you debug the issue, you will want to clean up after this test run with the following command:

```bash
docker-compose -f test-conf.yml down
```

### API Payload Documentation:

See [API Documentation Here](./docs/api.md) 
