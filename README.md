# Todo App API

This is a server todo app for managing todos for multiple users with different roles.
App build on Express.js and MongoDb.

## Features

* Todos management with all CRUD operations
* Querying arrays of todos with next parameters:
  * priority
  * completion
  * deadline periods
* Sorting todos by:
  * priority
  * deadline (default)
  * completion
* Two types of users:
  * admin - has permission to manage all todos
  * user - has permission to manage todos created by him

## Installation

```
git clone
npm install
```

create `.env` file accroding to `.env.example` or just rename it to provide environment variables

to test app

```
npm test
```

to run app
```
npm start
```
open Postman and do some requests...

## API routes

#### `POST /api/v1/users`
Creates new user. Required fields are: `email` and `password`. And one optional `type` for registration of administrator. First registered admin would be the only one.

#### `GET /api/v1/users`
Authentication required. For admin this one will respond with array of registered users. For user respond will contain info about his account.

#### `POST /api/v1/session`
Include `email` and `password` fields to authenticate and initiate a session.

#### `DELETE /api/v1/session`
Authentication required. Destroys session and log out user.

#### `POST /api/v1/todos`
Authentication required.

#### `GET /api/v1/todos/{id}`
Authentication required.

#### `PATCH /api/v1/todos/{id}`
Authentication required.

#### `DELETE /api/v1/todos/{id}`
Authentication required.

#### `GET /api/v1/todos`
Authentication required.



