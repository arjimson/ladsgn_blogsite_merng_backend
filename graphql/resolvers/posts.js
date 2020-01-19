const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { validatePostInput } = require('../../util/validators');
const { createWriteStream } = require('fs');
const path = require('path');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');



module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        //  uploadFile: async (_, { file }) => {
        //     const { createReadStream, filename } = await file;
        //     await new Promise(res =>
        //         createReadStream()
        //             .pipe(createWriteStream(path.join(__dirname, "../../images", filename)))
        //             .on("close", res)
        //     );

        //     files.push(filename)

        //     return true;
        // },

        async createPost(_, { body, postImagePath, file }, context) {
            const user = checkAuth(context);
            
            const { valid, errors } = validatePostInput(body, postImagePath);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const { createReadStream, filename } = await file;

            await new Promise(res =>
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "../../images", filename)))
                    .on("close", res)
            );

            const newPost = new Post({
                body,
                postImagePath : filename,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            context.pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post
        },

        async deletePost(_, { postId }, context) {

            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username);
                    await post.save();
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }

};