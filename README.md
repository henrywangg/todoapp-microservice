# TodoApp Microservice

TodoApp Microservice is a simple to-do application built with Node.js and Express.js. This application is developed to illustrate how to deploy microservices in a distributed system.

## Installation

To install TodoApp Microservice, you need to have Node.js and npm installed on your machine.

1. **Clone Repository**: Clone the project from GitHub to your computer using the following command:

    ```bash
    git clone https://github.com/henrywangg/todoapp-microservice.git
    ```

2. **Install Dependencies**: Navigate to the project directory and install the dependencies using npm:

    ```bash
    cd todoapp-microservice/todo-backend
    npm install
    ```

    ```bash
    cd todoapp-microservice/todo-frontend
    npm install
    ```

4. **Run the Application**: Start the application by running:

    ```bash
    cd todoapp-microservice/todo-backend
    npm start
    ```

     ```bash
    cd todoapp-microservice/todo-frontend
    npm install
    ```

## Usage

Once the application is successfully running, you can access it from the Postman application at `http://localhost:8080` for Backend and `http://localhost:8081` for Frontend. The application provides basic functionalities of a to-do app, including:

- **View Tasks**: Display the list of current tasks.
- **Add New Task**: Add a new task to the list.
- **Mark Task as Completed**: Mark a task as completed.
- **Delete Task**: Delete a task from the list.

## Microservices

TodoApp Microservice is divided into independent microservices, including:

- **Todo Service**: To-do management service.

Each service can be developed, deployed, and managed independently, creating a distributed system with scalability and flexibility.

## Author

TodoApp Microservice is developed by [Henry Wang](https://github.com/henrywangg).
