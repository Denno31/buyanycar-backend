const {gql} = require(`apollo-server`);

module.exports = gql`
  type Query {
    sayHi: String!
    # vehicle queries
    getVehicles(order: String, vehicleFilter: VehicleFilter): [Vehicle!]!
    getVehicle(vehicleId: ID!): Vehicle!
    getVehiclesByUser(userId: ID!): [Vehicle!]!
    getFavoriteVehicles(userId: ID): [Vehicle]!
    vehicleMakes: [VehicleMake!]!
    vehicleModels(vehicleMake: String!): [VehicleModel!]!
    getSimilarVehicles(vehicleMake: String!): [Vehicle!]!
    # county
    hello: String!
    getCounties: [County!]!
    # messages
    getMessages(fromUser: ID): [Message!]!
    getSubCounties(countyName: String!): [SubCounty!]!
    getChatUsers: [User!]!
    getTypes: MyType!
  }

  # vehicle types

  type Vehicle {
    _id: ID!
    transmission: String!
    price: Float!
    make: String!
    model: String!
    vehicleImageUrl: [String!]
    color: String!
    mileage: Float!
    description: String!
    phoneNumber: String!
    fuel: String!
    negotiable: Boolean!
    manufactureYear: String!
    condition: String!
    bodyType: String!
    vinChassisNumber: String
    vehicleOwner: User!
    location: String!
    engineSize: Float!
    registered: Boolean!
    area:String!
  }

  #user types
  type User {
    id: ID!
    email: String!
    token: String!
    firstName: String!
    lastName: String
    createdAt: String
    updatedAt: String
    phoneNumber: String
    tos: Boolean!
    favoriteVehicles: [ID]
    latestMessage: String
  }
  type ChatUser {
    latestMessage: String
    firstName: String
  }
  type VehicleMake {
    _id: ID!
    make: String!
  }
  type VehicleModel {
    model: String!
    make: String!
  }
  type County {
    name: String!
    code: String!
  }
  type SubCounty {
    name: String!
    subCounty: String!
  }
  type MyType {
    type: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String
    email: String!
    password: String!
    tos: Boolean!
    phoneNumber: String
  }

  # vehicle types
  input VehicleInput {
    transmission: String!
    price: Float!
    make: String!
    model: String!
    vehicleImageUrl: [String!]
    color: String!
    mileage: Float!
    description: String!
    phoneNumber: String!
    fuel: String!
    negotiable: Boolean!
    manufactureYear: String!
    registered: Boolean!
    condition: String!
    bodyType: String!
    vinChassisNumber: String
    location: String!
    area:String!
    engineSize: Float!
    _id: ID
  }

  input VehicleFilter {
    transmission: [String]
    price_min: Float
    price_max: Float
    make: String
    model: String
    color: [String]
    fuel: [String]
    manufactureYearMin: String
    manufactureYearMax: String
    registered: String
    condition: [String]
    bodyType: [String]
    location: String
    engineSize: [Float]
    area:String
  }
  type Message {
    _id:ID!
    content: String!
    fromUser: ID
    toUser: ID!
    createdAt: String
    users: [String!]!
  }
  type Mutation {
    # auth mutations
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!

    # user mutations
    postFavoriteVehicle(vehicleId: ID!): User!

    #vehicle mutations
    postVehicle(vehicleInput: VehicleInput): Vehicle!
    editVehicle(vehicleInput: VehicleInput): Vehicle!
    deleteVehicle(vehicleId: ID!): Vehicle!

    insertManyMakes: String!
    seedModels: String!
    # counties
    seedCounties: String!
    seedSubCounties: String!
    #mesage mutations
    postMessage(content: String!, to: ID!): Message!
  }
  type Subscription {
    newMessage:Message!
  }
 
`;
