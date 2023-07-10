# ExpressTS-MySQL-CRUD

ExpressTS-MySQL-CRUD is a backend application built with TypeScript, Express, and MySQL database. It provides a CRUD (Create, Read, Update, Delete) functionality for managing blog posts and users.

## Features

- User Management:

  - User registration with email, password, and name
  - User authentication using JSON Web Tokens (JWT)
  - Update user details (email, password, name)
  - Delete user account

- Blog Management:
  - Create a new blog post
  - Retrieve user-specific blogs
  - Retrieve all public blogs
  - Update blog post (title, content, type)
  - Delete blog post

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or above)
- MySQL server

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/SomnathKar000/ExpressTS-MySQL-CRUD.git
   ```

2. Install dependencies:

   ```shell
   cd ExpressTS-MySQL-CRUD
   npm install
   ```

3. Configure the MySQL database:

   - Create a new MySQL database.
   - Update the database connection settings in the `.env` file.

   - **Environment Variables**

     Create an `.env` file in the root directory of the project.
     Define the following environment variables in the `.env` file:

     - `DB_HOST=<your-host-url>` : The MySQL URL for connecting to the database.
     - `JWT_SECRET=<your-secret-key>` : The secret key used for authentication.
     - `DB_USER_NAME=<db-user-name>` : The MySQL username for connecting to the database.
     - `DB_PASSWORD=<db-password>` : The MySQL password for connecting to the database.
     - `DB_NAME=<db-name>` : The MySQL database name for connecting to the database.

4. Start the application:

   ```shell
   npm run start
   ```

5. The application should now be running at `http://localhost:5000` (for local development).

## API Endpoints

### Hosted API (Vercel)

The base URL for all the API endpoints is `https://express-ts-my-sql-crud.vercel.app/api/v1`.

### Local Development

The base URL for all the API endpoints is `http://localhost:5000/api/v1`.

### User Routes

- `POST /users` - Register a new user
- `GET /users` - Get user details (requires authentication)
- `PUT /users` - Update user details (requires authentication)
  - Request Body:
    - `updateData` : The value of the data you want to update
    - `updateKey` : The data field you want to update (email, password, name)
    - `password` : Your password for authentication
- `DELETE /users` - Delete user account (requires authentication)

### Blog Routes

- `POST /blogs` - Create a new blog post (requires authentication)
- `GET /blogs` - Get user-specific blogs (requires authentication)
- `GET /blogs/public` - Get all public blogs
- `PUT /blogs/:id` - Update a blog post (requires authentication)
- `DELETE /blogs/:id` - Delete a blog post (requires authentication)

### Authentication

User authentication is implemented using JSON Web Tokens (JWT). When a user logs in or registers, a JWT token is generated and returned in the response. This token should be included in the `auth_token` header of subsequent requests that require authentication. The header should be in the following format:

```
auth_token: <your-token>
```

## Error Handling

The application includes a custom error handling middleware that catches and handles errors throughout the application. The middleware returns appropriate HTTP status codes and error messages for each error scenario.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For more information or questions, feel free to reach out:

- Email: somnathkar2023@gmail.com
- LinkedIn: [Somnath Kar](https://www.linkedin.com/in/somnath-kar-aa73aa1a3)
- GitHub: [SomnathKar000](https://github.com/SomnathKar000)
