# Ryuzuya Chats Backend

This repository contains the backend services for Ryuzuya Chats, built with NestJS and Nx. It provides various APIs for user authentication, chat functionalities, project management, and integrations.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)

## Features

- **Authentication**: User registration, login, and session management using JWT.
- **Chat**: Real-time chat functionalities using WebSockets (NestJS Gateway) and Redis.
- **User Management**: APIs for managing user profiles.
- **Project Management**: APIs for creating and managing projects.
- **Integrations**: Modules for external service integrations.
- **Skill Categories & Tech Stack**: Management of skill categories and technology stacks.
- **Telegram Integration**: Specific modules for Telegram-related functionalities.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn
- Docker (for running MongoDB and Redis)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ryuzuya-chats.git
    cd ryuzuya-chats
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `env.example` (you might need to create `env.example` first, or refer to the `config` module for required variables).

    Example `.env` content:

    ```
    MONGO_URI=mongodb://localhost:27017/ryuzuya_chats
    REDIS_HOST=localhost
    REDIS_PORT=6379
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION_TIME=3600s
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    JWT_REFRESH_EXPIRATION_TIME=7d
    ```

4.  **Start Docker services (MongoDB and Redis):**

    ```bash
    docker-compose up -d
    ```
    *(Note: You might need to create a `docker-compose.yml` file if it doesn't exist, or manually start MongoDB and Redis.)*

## Running the Application

To run the development server:

```bash
npx nx serve ryuzuya-chats
```

The application will typically run on `http://localhost:3000`.

## Running Tests

To run all unit and integration tests:

```bash
npx nx test ryuzuya-chats
```

To run end-to-end tests:

```bash
npx nx e2e ryuzuya-chats-e2e
```

## Project Structure

The core application logic resides in `apps/ryuzuya-chats/src/app/`. Key modules include:

-   `auth/`: Authentication logic, guards, strategies.
-   `chat/`: Real-time chat gateway and services.
-   `config/`: Application configuration files.
-   `database/`: Database connection setup.
-   `integrations/`: External service integrations.
-   `projects/`: Project management.
-   `skill-categories/`: Skill category management.
-   `tech-stack/`: Technology stack management.
-   `telegram/`: Telegram specific functionalities.
-   `users/`: User management.