const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql')

const app = express()
let userList = [
  { id: "1", name: "tu1", email: "tu1@test.com" },
  { id: "2", name: "tu2", email: "tu2@test.com" },
  { id: "3", name: "tu3", email: "tu3@test.com" }
]

// type 
const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
})
// query structure to query data
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    // to get all users
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return userList
      }
    },
    // to get user by id
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return userList.find((user) => user.id === args.id)
      }
    }
  }
})

const mutations = new GraphQLObjectType({
  name: "mutations",
  fields: {
    addUser: {
      type: UserType,
      args: { name: { type: GraphQLString }, email: { type: GraphQLString } },
      resolve(parent, { name, email }) {
        const newUser = { id: Math.floor(Math.random() * 10000), name, email }
        userList.push(newUser)
        return newUser
      }
    },
    // updating user
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString }
      },
      resolve(parent, { id, name, email }) {
        const user = userList.find(user => user.id === id)
        user.name = name
        user.email = email
        return user
      }
    },
    // delete user
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        user = userList.find(u => u.id === id)
        userList = userList.filter(u => u.id !== id)
        return user
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(8080, () => {
  console.log('server running on http://localhost:8080')
})