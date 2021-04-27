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
type chatRoom{
    _id: ID!
    name: String!
    chat: [String!]!
}
type chatData{
    chat: [String!]!
    count: Int!
}
type authData
{
    userId: ID!
    token: String!
    tokenExpiration: Int!
}
type RootQuery {
    userList: [userData!]!
    AllRooms(cursor:ID ,limit:Int): [chatRoom!]!
    login(email: String! ,password: String!): authData!
    getChat(roomId:ID):chatData!
}
type RootMutation {
    createUser(newUser: userInput): userData!
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
