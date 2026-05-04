## Technical Retrospective

### Positive aspects

- **NestJS**  
  The backend framework was tied to the subject constraints.  
  It was still interesting for starting backend development with a clear structure.  
  Modules, services and controllers provide a cleaner structure than an unorganized Node backend.

- **PostgreSQL**  
  Well suited for this project because the data is highly relational.  
  The project handles users, friends, messages, channels, games and achievements.  
  A relational database makes more sense here than a document-oriented database.

- **Prisma**  
  Good fit for a TypeScript project.  
  Compared to older ORMs like TypeORM or Sequelize, Prisma provides a readable central schema and generates useful backend types.  
  This makes the data model easier to understand quickly.

- **Phaser**  
  Relevant for a 2D browser game.  
  Compared to React alone, Phaser is much better suited for handling a game loop, scenes, inputs and real-time rendering.  
  An alternative like Three.js would make more sense for 3D, but would likely be too heavy for a 2D Pong game.

### Issues

- **Prisma**  
  Prisma makes database access much easier.  
  The risk is thinking less about SQL queries, indexes and real database performance, but it should not be an issue with a project of this size.

- **Phaser + React**  
  The integration adds complexity.  
  React works with a declarative UI model.  
  Phaser works with scenes and a game loop.  
  A clear boundary between both is necessary.

- **Webpack**  
  Too heavy today for this type of frontend.  
  Vite would probably be simpler, faster and easier to maintain.

- **Docker**  
  Some image versions were not pinned strictly enough.  
  Concrete example: a newer Node image broke the backend during a rebuild. `Node` version issue. 

### Possible improvements

- Replace **Webpack** with **Vite**.
- I really enjoy **Tailwind** so maybe it could've been better.
- Design was quite horrible but it isn't code related