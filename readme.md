# Mentor Match v3 readme

## What's new?
1. Proper linting
2. Sequelize ORM with defined models/relationships
3. A real MCV split
4. Logging that can be ingested by a 3rd party service
5. Logically separated routes with tidier controllers
6. Actual folder structure:
```
  - mm3
    - assets (sass stylesheets)
    - controllers (takes request and calls up a model for data)
    - helpers (logging, crypto etc)
    - logs (somewhere to keep them)
    - middleware (functions to be used on express routes - like isAuthenticated/isAdmin)
    - models (definitions/relationships - see sequelize ORM docs)
    - public
      - stylesheets
      - js
      - images
    - routes (as simple a breakdown as possible - calls relevant middleware and throws request over to a controller)
    - test ()
    - views (kept mm2 templates for now as re-templating or further tidying can be done in the future)
```
## Todo
1. Decide if this approach makes sense
2. Finish adding models/relationships
3. Gradually bring in more routes/controllers
4. Re-implement the passportJS LinkedIn login
5. Get functionality on par with mm2
6. Get AWS managed database set up and transfer data over
7. Try out logstash for better analysis of new logs
8. Play with elastic search to improve search results
