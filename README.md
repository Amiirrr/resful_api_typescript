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

```

