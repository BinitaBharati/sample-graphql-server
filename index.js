var express = require('express');
var { graphqlHTTP } = require('express-graphql');
//var { buildSchema } = require('graphql');
import { makeExecutableSchema } from '@graphql-tools/schema';
const cors = require('cors');



const schemaString = `
type Query {
    about: String,
    allBlogs: [Post],
    allAuthors: [Author],
    authorWithAlias(alias: String!): Author,
    blogWithTag(tag: String!): [Post]
    
  },
type Author {
    alias: String!,
    firstName: String!,
    lastName: String,
    email: String,
},

type Post {
    title: String!,
    content: String!,
    tag: [String]!,
    author: Author!,
    
}`;

const authors=[
                {alias: 'author-1', firstName: 'Decky', lastName: 'Swiss', email:'decky@myorg.sw'},
                {alias: 'author-2', firstName: 'Shikha', lastName: 'Gupta', email:'skikhagupta@mpegasus.pub.in'},
                {alias: 'author-3', firstName: 'Tom', lastName: 'Alex', email:'tomal@mdreamcatcher.us'}
            ];

const posts=[
    {
        title: 'Hello world', content: 'once upon a time blah blah', tag: 'tricera', author: 
        {
            alias: 'author-1', firstName: 'Decky', lastName: 'Swiss', email:'decky@myorg.sw'
        }
    },
    {
        title: 'Tricera tops', content: 'triceratops blah blah', tag: 'tricera', author: 
        {
            alias: 'author-2', firstName: 'Shikha', lastName: 'Gupta', email:'skikhagupta@mpegasus.pub.in'
        }
    },
    {
        title: 'macbeth', content: 'macbeth blah blah', tag: 'macbeth', author: 
        {
            alias: 'author-3', firstName: 'Tom', lastName: 'Alex', email:'tomal@mdreamcatcher.us'
        }
    },
    {
        title: 'white sands', content: 'white sands blah blah', tag: 'whitesands', author: 
        {
            alias: 'author-1', firstName: 'Decky', lastName: 'Swiss', email:'decky@myorg.sw'
        }
    },
];

const customSchema = makeExecutableSchema({ typeDefs: schemaString});

var root = {
    about: () => {
        return "Welcome to world's coolest blogging site..."
    },
    allBlogs: () => {
      return posts;
    },
    allAuthors: () => {
      return authors
    },
    authorWithAlias: ({alias}) => {
      var matchedAuthor = authors.filter(eachAuthor => {
        if(eachAuthor.alias === alias) {
            return true;
        }
        return false;
      });
      return matchedAuthor[0];

    },
    blogWithTag: ({tag}) => {
        var matchedPosts = posts.filter(eachPost => {
          if(eachPost.tag === tag) {
              return true;
          }
          return false;
        });
        return matchedPosts;
  
      },
  }; 
   
  var app = express();
  app.use(cors());
  
  app.use('/graphql', graphqlHTTP({
    schema: customSchema,
    rootValue: root,
    graphiql: true,
  }));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
