# ft_transcendence

**ft_transcendence** is a fullstack web project from the **42 curriculum**.

The goal was to design and build a complete web application around the classic **Pong** game.

## Project Requirements

The subject required building a web platform where users can play **Pong** directly from the browser.

The main requirements included:

- a **single-page application**;
- a **real-time Pong game**;
- a **multiplayer mode**;
- fair gameplay rules for all players;
- Docker-based execution with a single command;
- compatibility with the latest stable version of **Google Chrome**;
- local storage of secrets through `.env` files;
- user input validation;
- authentication-related security features.

The project could also be extended with optional modules.

Relevant optional modules implemented or partially covered in this project include:

- **Backend framework** — implemented with **NestJS**.
- **Frontend framework / toolkit** — implemented with **React** and **TypeScript**.
- **Backend database** — implemented with **PostgreSQL** and **Prisma**.
- **Standard user management** — profiles, account management, friends, match history and achievements.
- **Remote authentication** — authentication through the **42 API**.
- **Remote players** — online multiplayer features.
- **Live chat** — direct messages and discussion channels.
- **User statistics and game history** — rankings, match history and achievements.
- **2FA and JWT authentication** — stronger authentication flow.
- **Game customization** — multiple playable characters.
- **Responsive design** — support for different screen sizes.

## Stack

### Frontend

- **React**
- **TypeScript**
- **Webpack**
- **Phaser**

### Backend

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma**

The backend handles:
- the application API;
- authentication;
- user-related features;
- game-related data;
- real-time communication.

### Database

- **PostgreSQL**
- **Prisma ORM**

PostgreSQL is used as the main database.  
Prisma is used to model the database schema and interact with persisted data.

## Usage

To use the authentication flow, the project requires a **42 API Key**.

When creating the application on the **42 API website**, the redirect URL must be set to:

http://localhost:3000/auth/42/callback

Then, the following environment variables must be configured in `backend/files/.env`:

- `FortyTwoClientID`
- `FortyTwoSecret`
- `FortyTwoCallBackURL`

Example:

FortyTwoClientID=your_client_id  
FortyTwoSecret=your_client_secret  
FortyTwoCallBackURL=http://localhost:3000/auth/42/callback

For obvious reasons I cannot push the `GoogleAuth` secret so I added a Guest Login in order to be able to test the project without having to change any `.env` file

Once the environment variables are configured, the project can be started with Docker Compose.

The application is then available at:

http://localhost:8080