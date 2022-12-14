import dotenv from 'dotenv';
import { MongoDB } from "../../database/MongoDB.js";
import Post from '../schema/Post.js';

dotenv.config();

export class PostController
{
    constructor()
    {
        MongoDB.connectDB().then();
    }

    async getPosts()
    {
        return await Post.find().sort( { "date": -1 } ).lean();
    }
    async getPostById (postId)
    {
        return await Post.findById({_id: postId}).sort( { "date": -1 } ).lean();
    }
    async addComment(postId, comment)
    {
        return await Post.updateOne(
            {_id: postId},
            {$push:{"comments" : comment}}
        );
    }

    async addLike(postId)
    {
        return await Post.updateOne(
            {_id: postId},
            { $inc: { likes: 1 } }
        );
    }

    async suppLike(postId)
    {
        return await Post.updateOne(
            {_id: postId},
            { $inc: { likes: -1 } }
        );
    }

    async insertPost(postData)
    {
        const post = new Post(postData);
        return await post.save();
    }
    async generateId()
    {
        const posts = await this.getPosts();

        let id = 0;

        for (let post of posts)
        {
            if (post["_id"] > id)
            {
                id = post["_id"];
            }
        }
        return (id + 1);
    }

    async deletePost(postId)
    {
        return await Post.deleteOne({ _id : postId});
    }

    async findBSearch(createdBy, seach) {
        return await Post.find(
            createdBy
        ).sort(
            seach
        ).lean();

    }
}
