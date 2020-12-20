import {MikroORM} from '@mikro-orm/core'
import { __prod__ } from './constants';
//import { Post } from './entities/Post';
import "reflect-metadata";
import mikroConfig from "./mikro-orm.config"
import express from 'express';
import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { MyContext } from './types';

const main = async()=>{
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    // const post  = orm.em.create(Post,{title:'New Post'});
    // await orm.em.persistAndFlush(post);

    // const posts = await orm.em.find(Post,{});
    // console.log(posts);
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch:true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                secure: __prod__,
                sameSite:'lax',
            },
            saveUninitialized:false,
            secret: "dkjadkadnkla",
            resave: false,
        })
    )
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[HelloResolver,PostResolver,UserResolver],
            validate: false,
        }),
        context: ({ req, res }) : MyContext => ({em: orm.em,req,res})
    });
    apolloServer.applyMiddleware({app});
    app.listen(3000,()=>{
        console.log('server started on localhost:3000')
    });
}


main().catch(err=>{
    console.error(err);
});