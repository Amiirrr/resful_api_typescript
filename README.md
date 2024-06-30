# Setup Project

Create .env file
```
DATABASE_URL="mysql://root:@localhost:3306/restful_api_typescript"
```

``` shell
npm install
npx prisma migrate dev
npx prisma generate
tsc
node dist/main.js
    
## Built With
- Typescript
- Prisma
- Express Js

## What did i learn?
- Typescript, OOP, Generic,  
- Prisma as ORM
  - Model
  - Schema
  - Relation
- Babel-jest for testing
- **Winston** for logging
- **Supertest** for HTTP testing
- Manual testing (.http)
- **Zod** for validation

```

