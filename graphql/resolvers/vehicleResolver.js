const { UserInputError } = require("apollo-server");
const Vehicle = require("../../models/Vehicle");
const VehicleMake = require("../../models/VehicleMake");
const VehicleModel = require("../../models/VehicleModels");
const checkAuth = require("../../utils/checkAuth");
const {
  vehicleSchema,
  validateVehicleInput,
} = require("../../utils/validators");
//const fetch = require("node-fetch");
const axios = require("axios");

const resolvers = {
  Query: {
    //get vehicles
    async getVehicles(_, { order }) {
      console.log(order);
      try {
        let sortOrder =
          order === "recommended"
            ? { createdAt: -1 }
            : order === "newest"
            ? { createdAt: -1 }
            : order === "oldest"
            ? { createdAt: 1 }
            : order === "highest"
            ? { price: -1 }
            : order === "lowest"
            ? { price: 1 }
            : { createdAt: -1 };
        const vehicles = await Vehicle.find()
          .sort(sortOrder)
          .populate("vehicleOwner");
        return vehicles;
      } catch (err) {
        throw new Error(err);
      }
    },

    //get a single vehicle
    async getVehicle(_, { vehicleId }) {
      try {
        const vehicle = await Vehicle.findById(vehicleId).populate(
          "vehicleOwner"
        );
        if (vehicle) {
          return vehicle;
        } else {
          throw new Error("Vehicle not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    //vehicle makes
    async vehicleMakes() {
      try {
        const vehicleMakes = await VehicleMake.find();

        return vehicleMakes;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    // vehicle models
    async vehicleModels(_, { vehicleMake }) {
      try {
        const models = await VehicleModel.find({ make: vehicleMake });
        // const data = response; // Here you have the data that you need

        return models;
      } catch (err) {
        throw new Error(err);
      }
    },

    getTypes() {
      return { type: "bright" };
    },
  },
  // vehicle mutations
  Mutation: {
    async postVehicle(parent, { vehicleInput }, context) {
      const user = checkAuth(context);

      try {
        // const validationResult = await vehicleSchema.validateAsync(
        //   vehicleInput
        // );
        console.log(vehicleInput);
        const { errors, valid } = validateVehicleInput(vehicleInput);
        console.log(errors);
        console.log(valid);
        if (!valid) {
          return new UserInputError("Errors", { errors });
        }
        // console.log(validationResult);
        const newVehicle = new Vehicle({
          ...vehicleInput,
          vehicleOwner: user.id,
        });

        const vehicle = await newVehicle.save();
        return vehicle;
      } catch (err) {
        //console.log(err);
        throw new Error(err);
      }
    },
    // updateVehicle
    async editVehicle(_, { vehicleInput }, context) {
      const user = checkAuth(context);
      // TODO: check if user is the owner or admin
      try {
        const vehicle = await Vehicle.findById(vehicleInput._id);
        if (!vehicle) {
          throw new Error("Vehicle not found");
        }
        vehicle.price = vehicleInput.price || vehicle.price;
        vehicle.transmission =
          vehicleInput.transmission || vehicle.transmission;
        vehicle.location = vehicleInput.location || vehicle.location;
        vehicle.make = vehicleInput.make || vehicle.make;
        vehicle.color = vehicleInput.color || vehicle.color;
        vehicle.condition = vehicleInput.condition || vehicle.condition;
        vehicle.model = vehicleInput.model || vehicle.model;
        vehicle.mileage = vehicleInput.mileage || vehicle.mileage;
        vehicle.vinChassisNumber =
          vehicleInput.vinChassisNumber || vehicle.vinChassisNumber;
        vehicle.registered = vehicleInput.registered;
        vehicle.description = vehicleInput.description || vehicle.description;
        vehicle.phoneNumber = vehicleInput.phoneNumber || vehicle.phoneNumber;
        vehicle.negotiable = vehicleInput.negotiable;
        vehicle.manufactureYear =
          vehicleInput.manufactureYear || vehicle.manufactureYear;
        vehicle.bodyType = vehicleInput.bodyType || vehicle.bodyType;
        vehicle.fuel = vehicleInput.fuel || vehicle.fuel;
        vehicle.engineSize = vehicleInput.engineSize || vehicle.engineSize;
        vehicle.vehicleImageUrl =
          vehicleInput.vehicleImageUrl || vehicle.vehicleImageUrl;

        let updatedVehicle = await vehicle.save();

        return updatedVehicle;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    // delete vehicle
    async deleteVehicle(_, { vehicleId }, context) {
      const user = checkAuth(context);
      // TODO: check if user is the owner or admin
      try {
        const deletedVehicle = await Vehicle.findOneAndDelete({
          _id: vehicleId,
        });
        return deletedVehicle;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async insertManyMakes() {
      const makes = await VehicleMake.insertMany([
        { make: "Toyota" },

        { make: "Nissan" },

        { make: "Subaru" },

        { make: "Mazda" },

        { make: "Mercedes-Benz" },

        { make: "Alfa Romeo" },

        { make: "Audi" },

        { make: "Bentley" },

        { make: "BMW" },

        { make: "Cadillac" },

        { make: "Chery" },

        { make: "Chevrolet" },

        { make: "Chrysler" },

        { make: "Citroen" },

        { make: "Daewoo" },

        { make: "Daihatsu" },

        { make: "Datsun" },

        { make: "Dodge" },

        { make: "Faw" },

        { make: "Fiat" },

        { make: "Ford" },

        { make: "Foton" },

        { make: "Great Wall" },

        { make: "Holden" },

        { make: "Honda" },

        { make: "Hummer" },

        { make: "Hyundai" },

        { make: "Isuzu" },

        { make: "Jaguar" },

        { make: "Jeep" },

        { make: "JMC" },

        { make: "Kia" },

        { make: "Land Rover" },

        { make: "Lexus" },

        { make: "Mahindra" },

        { make: "Mini" },

        { make: "Mitsubishi" },

        { make: "Mobius" },

        { make: "Morris" },

        { make: "Opel" },

        { make: "Peugeot" },

        { make: "Porsche" },

        { make: "Proton" },

        { make: "Renault" },

        { make: "Rover" },

        { make: "Skoda" },

        { make: "Smart" },

        { make: "SsangYong" },

        { make: "Suzuki" },

        { make: "Tata" },

        { make: "Vauxhall" },

        { make: "Volkswagen" },

        { make: "Volvo" },

        { make: "Other Make" },
      ]);
      return "success";
    },
    async seedModels() {
      const modelsData = require("../../vModelsData");
      const vehicleModel = await VehicleModel.insertMany(modelsData);
      return "success";
    },
  },
};
module.exports = resolvers;
