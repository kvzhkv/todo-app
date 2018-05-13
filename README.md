# Todo App API

This is a server todo app for managing todos for multiple users with different roles.
App build on Express.js and MongoDB.

## Requirements

Node.js and MongoDB installed.

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
git clone https://github.com/kvzhkv/todo-app.git
cd todo-app
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
Authentication required. Creates new todo.
Required fields are: 
  * `task` - not empty string
  * `deadline` - date as `YYYY-MM-DD` or YYYY-MM-DDThh:mm:ss.sssZ
Optional field:
  * `priority` - could be `0`, `1`, `2`, `3`, if not provided defaults to 0

#### `GET /api/v1/todos/{id}`
Authentication required. Gets todo by ID. Admin can get any todo in db, user can get only those he created.

#### `PATCH /api/v1/todos/{id}`
Authentication required. Updates todo by ID. Admin can update any todo in db, user can update only those he created.
Optional fields:
  * `task`
  * `priority`
  * `completed` - boolean. If `true` app also sets `completedAt` field with current date.
  * `deadline`

#### `DELETE /api/v1/todos/{id}`
Authentication required. Deletes todo by ID. Admin can delete any todo in db, user can delete only those he created.

#### `GET /api/v1/todos`
Authentication required. Gets todos according to query params, example: `/api/v1/todos?completed=false&sort=priority`. Admin can get all todos in db, user can get only those he created. 
Possible query params:
  * `sort` - possible values: `deadline` (default), `-deadline` (for descending sort), `priority`, `-priority`, `completed`, `-completed`
  * `priority`
  * `completed`
  * `startdate` - date value as `YYYY-MM-DD`
  * `enddate` - date value as `YYYY-MM-DD`


