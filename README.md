# Technical-Interview-Wolman


## Getting Started

To start this repository in development mode, follow the next steps:

1. Clone this repository.
2. Install the necessary Node.js modules by running `npm install`.
3. Clone .env.template and rename it to .env.
4. Fill the environment variables.
5. Run `docker compose up -d`.
6. Run `npm run dev`.

## Environment Variables

The following environment variables are required for the application to run properly:

- `PORT`: The port on which the server will run.
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.
- `MONGO_URL`: The URL of your MongoDB server.
- `MONGO_DB_NAME`: The name of your MongoDB database.
- `MONGO_USER`: The username for your MongoDB database.
- `MONGO_PASS`: The password for your MongoDB database.
- `FRONTEND_ORIGIN`: The origin URL of the frontend application. This is used for configuring CORS policies.
- `NODE_ENV`: The environment in which your application is running (development, production, etc.).

Please refer to the `.env.template` file and fill in the appropriate values.
