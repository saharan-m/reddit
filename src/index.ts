import {MikroORM} from '@mikro-orm/core'
import { __prod__ } from './constants';
//import { Post } from './entities/Post';
import mikroConfig from "./mikro-orm.config"
import express from 'express';

const main = async()=>{
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    // const post  = orm.em.create(Post,{title:'New Post'});
    // await orm.em.persistAndFlush(post);

    // const posts = await orm.em.find(Post,{});
    // console.log(posts);
    app.listen(4000,()=>{
        console.log('server started on localhost:4000')
    });
}


main().catch(err=>{
    console.error(err);
});