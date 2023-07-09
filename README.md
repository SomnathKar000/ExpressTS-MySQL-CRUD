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
   git clone https://github.com/your/repository.git
   ```

2. Install dependencies:

   ```shell
   cd ExpressTS-MySQL-CRUD
   npm install
   ```

3. Configure the MySQL database:

   - Create a new MySQL database.
   - Update the database connection settings in the `src/database/connection.ts` file.

4. Build the TypeScript code:

   ```shell
   npm run build
   ```

5. Start the application:

   ```shell
   npm start
   ```

6. The application should now be running at `http://localhost:3000`.

## API Endpoints

### User Routes

- `POST /users` - Register a new user
- `GET /users` - Get user details (requires authentication)
- `PUT /users` - Update user details (requires authentication)
- `DELETE /users` - Delete user account (requires authentication)

### Blog Routes

- `POST /blogs` - Create a new blog post (requires authentication)
- `GET /blogs` - Get user-specific blogs (requires authentication)
- `GET /blogs/public` - Get all public blogs
- `PUT /blogs/:id` - Update a blog post (requires authentication)
- `DELETE /blogs/:id` - Delete a blog post (requires authentication)

### Authentication

User authentication is implemented using JSON Web Tokens (JWT). When a user logs in or registers, a JWT token is generated and returned in the response. This token should be included in the `Authorization` header of subsequent requests that require authentication. The header should be in the following format:

```
Authorization: Bearer <token>
```

## Error Handling

The application includes a custom error handling middleware that catches and handles errors throughout the application. The middleware returns appropriate HTTP status codes and error messages for each error scenario.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please open an issue or submit a pull request.

Feel free to customize and modify the README file according to your project's specific details.
