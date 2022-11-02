# Redis Movies 

    This is the frontend for the RedisMovies project 

## How to build & deploy? 

---
**NOTE**: Startup Procedure Required: 
   1. Start Redis-Stack `$ docker start redis-stack`
   2. Start the Java Service `$ mvn spring-boot:run`
   3. Start the frontend `$ yarn start`
   4. ✨  Done
----

Software Versions used:
```
$ npm -version
8.15.0

$ $ yarn -version
1.22.17

```

1. Install all necessary node modules: `yarn install --check-files`
   ```yarn install v1.22.17
   [1/4] 🔍  Resolving packages...
   [2/4] 🚚  Fetching packages...
   [3/4] 🔗  Linking dependencies...
   warning " > ... " 
   ✨  Done in 90.35s.
   ```

2. Start the server up: 
   ```
   $ yarn start 
      yarn run v1.22.17
      $ react-scripts start
      (node:23889) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
      (Use `node --trace-deprecation ...` to show where the warning was created)
      (node:23889) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
      Starting the development server...
      Compiled successfully!
   
      You can now view tmovies in the browser.
   
      Local:            http://localhost:3000
      On Your Network:  http://192.168.0.16:3000
   
      Note that the development build is not optimized.
      To create a production build, use yarn build.
   
      webpack compiled successfully```

2. Navigate to http://localhost:3000

## React Website Resources

    - Google font: https://fonts.google.com/
    - Boxicons: https://boxicons.com/
    - Images: https://unsplash.com/
    - API: https://www.themoviedb.org/

