# BOPTest Dashboard

### Docker

This site is developed and deployed using [Docker](https://www.docker.com/). To set up a development environment:

1. Clone this repoistory.
2. [Download](https://www.docker.com/products/overview) and install Docker.
3. Start the docker service on your machine.

### Auth

The Auth source of truth for this application resides within [Amazon Cognito](https://aws.amazon.com/cognito/). Sessions are managed within our own backend server, but all password related information and operations lies within and flows through cognito via the [Amazon Cognito Identity SDK](https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js). They have a comprehensive README with examples for common operations.

# Auth Note:

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

Open that file and fill in your credentials for Cognito from the User Pools General Settings page(for User Pool ID) and User Pools App Client Settings page (for App Client ID). Then choose a unique and memorable session name, and a secure [session secret](https://randomkeygen.com/).

The last two Environment Variables are comma separated lists of email addresses that gain certain permissions within the app.

Example:
`SUPER_USERS=anemail@gmail.com,anotheremail@gmail.com,finalemail@gmail.com`

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
