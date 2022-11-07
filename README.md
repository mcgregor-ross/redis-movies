# Redis Movies 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/redis-projects/redis-movies)

This project contains multiple resources to explore and use Redis Search + Redis JSON

High level arch: 
!["Redis Movies Overview"](./resources/images/architecture.png)


## Projects 

---
**NOTE**: Startup Procedure Required:
1. Start Redis-Stack `$ docker start redis-stack`
2. Start the Java Service `$ mvn spring-boot:run`
3. Start the frontend `$ yarn start`
4. ✨  Done
----

1. Redis Stack : https://redis.io/docs/stack/
2. Spring-Redis Java Movies Service ---> [Java Service](./spring-redis-search-om-api)
3. React Frontend Movies ---> [React Movies Site](./frontend)

### Docker

There is a docker compose script which will bootstrap all the components required to make this demo work.

1. Run `docker compose up` from the root dir
2. The containers will start in the correct order
3. On startup:

- The Java Service will bootstrap `Redis-Stack` with 9876 movies
- - update the docker-compose env to disable: MOVIE_INSERT_ON_STARTUP=false
```bash
movie-service  | 2022-11-07 16:19:34.500  INFO 1 --- [main] io.redis.configuration.DataLoader        : Loading sample data movies file from dir : './' with the provided path : ./movies.json
movie-service  | 2022-11-07 16:19:35.445  INFO 1 --- [main] io.redis.configuration.DataLoader        : Loading 9897 movies into Redis
movie-service  | 2022-11-07 16:19:47.184  INFO 1 --- [main] io.redis.configuration.DataLoader        : Finished loading data into Redis
```


### Software Reqs 

 - Docker 
 - Java 11+ 
 - NPM 8+
 - Node v18.7.0
 - Yarn 1.22.17+

### React Preview 

!["Redis Movies Overview"](./resources/images/redis-movies-overview.png)
