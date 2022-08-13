const gql = require(`graphql-tag`);

module.exports = gql`
  type Query {
    sayHi: String!
    # vehicle queries
    getVehicles(order: String): [Vehicle!]!
    getVehicle(vehicleId: ID!): Vehicle!
    getVehiclesByUser(userId: ID!): [Vehicle!]!
    vehicleMakes: [VehicleMake!]!
    vehicleModels(vehicleMake: String!): [VehicleModel!]!
    # county
    hello: String!
    getCounties: [County!]!
    getSubCounties(countyName: String!): [SubCounty!]!
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
    engineSize: Float!
    _id: ID
  }

  type Mutation {
    # auth mutations
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!

    #vehicle mutations
    postVehicle(vehicleInput: VehicleInput): Vehicle!
    editVehicle(vehicleInput: VehicleInput): Vehicle!
    deleteVehicle(vehicleId: ID!): Vehicle!
    insertManyMakes: String!
    seedModels: String!
    # counties
    seedCounties: String!
    seedSubCounties: String!
  }
`;
