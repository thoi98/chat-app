/* building GraphQL Schema */
module.exports = `
type userData {
    _id: ID!
    username: String!
    email: String!
    password: String!
}
input userInput{
    username: String!
    email: String!
    password: String!
}
type RootQuery {
    userList: [userData!]!
    AllRooms: [chatRoom!]!
}
type DeleteRes{
    response:String!
}

type chatRoom{
    _id: ID!
    name: String!
    chat: [String!]!
}


type RootMutation {
    createUser(newUser: userInput): userData!
    deleteUser(username: String!): DeleteRes!
    createRoom(name: String!): chatRoom!
    sendMessage(roomId: String!,msg: String!): String!
}
type Subscription{
    user: userData!
    newMessage(chatRoom: String!): String!
}
schema {
    query: RootQuery
    mutation: RootMutation
    subscription: Subscription
}
`;
