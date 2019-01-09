# Population Management API

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Run your tests
```
npm t
```

### API



Request type | Endpoint                 | Action
-------------|--------------------------|--------------------------------------------------
POST         | /api/v1/locations        | adds a location to the database
GET	         | /api/v1/locations/:id    | Gets a location and it's subtree as well as their location summary from the databse
PUT	         | /api/v1/locations/:id    | Modifies a location in the database
DELETE	         | /api/v1/locations/:id    | Deletes a location and it's subtree from the databse

