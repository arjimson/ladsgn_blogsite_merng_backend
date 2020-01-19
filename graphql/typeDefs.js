const { gql } = require('apollo-server');


module.exports = gql`

    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        postImagePath: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        files: [String]
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    type Mutation{
        # uploadFile(file: Upload!) : Boolean
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!, postImagePath: String, file: Upload!): Post!
        deletePost(postId: String!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
    type Subscription{
        newPost: Post!
    }
`