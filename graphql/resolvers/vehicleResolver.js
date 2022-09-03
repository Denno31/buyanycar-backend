const { UserInputError } = require("apollo-server");
const User = require("../../models/User");
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
    async getVehicles(_, { order, vehicleFilter }) {
      const make = vehicleFilter.make;
      const model = vehicleFilter.model;
      console.log("model: ", model);
      const makeFilter = make && make !== "all" ? { make } : {};
      const modelFilter = model && model !== "all" ? { model } : {};
      const registeredFilter =
        vehicleFilter.registered === "YES"
          ? { registered: true }
          : vehicleFilter.registered === "NO"
          ? { registered: false }
          : {};
      const manufactureYearMin =
        vehicleFilter.manufactureYearMin &&
        Number(vehicleFilter.manufactureYearMin) !== 0
          ? Number(vehicleFilter.manufactureYearMin)
          : 0;
      const manufactureYearMax =
        vehicleFilter.manufactureYearMax &&
        Number(vehicleFilter.manufactureYearMax) !== 0
          ? Number(vehicleFilter.manufactureYearMax)
          : 0;
      const manufactureYearFilter =
        manufactureYearMin && manufactureYearMax
          ? {
              manufactureYear: {
                $gte: manufactureYearMin,
                $lte: manufactureYearMax,
              },
            }
          : {};
      console.log(vehicleFilter);
      const conditionFilter =
        vehicleFilter.condition && vehicleFilter.condition.length > 0
          ? vehicleFilter.condition.map((c) => {
              return {
                condition: c,
              };
            })
          : [{}];
      const bodyTypeFilter =
        vehicleFilter.bodyType && vehicleFilter.bodyType.length > 0
          ? vehicleFilter.bodyType.map((c) => {
              return {
                bodyType: c,
              };
            })
          : [{}];
      const engineSizeFilter =
        vehicleFilter.engineSize && vehicleFilter.engineSize.length > 0
          ? vehicleFilter.engineSize.map((c) => {
              return {
                engineSize: Number(c),
              };
            })
          : [{}];
      const colorFilter =
        vehicleFilter.color && vehicleFilter.color.length > 0
          ? vehicleFilter.color.map((c) => {
              return {
                color: c,
              };
            })
          : [{}];
      const fuelFilter =
        vehicleFilter.fuel && vehicleFilter.fuel.length > 0
          ? vehicleFilter.fuel.map((c) => {
              return {
                fuel: c,
              };
            })
          : [{}];
      const transmissionFilter =
        vehicleFilter.transmission && vehicleFilter.transmission.length > 0
          ? vehicleFilter.transmission.map((c) => {
              return {
                transmission: c,
              };
            })
          : [{}];

      const price_min =
        vehicleFilter.price_min && Number(vehicleFilter.price_min) !== 0
          ? Number(vehicleFilter.price_min)
          : 0;
      const price_max =
        vehicleFilter.price_max && Number(vehicleFilter.price_max) !== 0
          ? Number(vehicleFilter.price_max)
          : 0;
      const priceFilter =
        price_min >= 0 && price_max > 0
          ? {
              price: {
                $gte: price_min,
                $lte: price_max,
              },
            }
          : price_min > 0 && price_max === 0
          ? {
              price: {
                $gte: price_min,
              },
            }
          : {};

      console.log(modelFilter);
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
        const vehicles = await Vehicle.find({
          ...makeFilter,
          ...modelFilter,
          ...manufactureYearFilter,
          ...priceFilter,
          ...registeredFilter,
          $or: [...conditionFilter],
          $or: [...bodyTypeFilter],
          $or: [...engineSizeFilter],
          $or: [...colorFilter],
          $or: [...fuelFilter],
          $or: [...transmissionFilter],
        })
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
    //get vehicles by user
    async getVehiclesByUser(_, { userId }) {
      try {
        const vehicle = await Vehicle.find({ vehicleOwner: userId }).populate(
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
    async getFavoriteVehicles(_, { userId }, context) {
      const userContext = checkAuth(context);
      console.log(userId);
      try {
        const user = await User.findOne({ _id: userContext.id }).populate(
          "favoriteVehicles"
        );
        return user.favoriteVehicles;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSimilarVehicles(_, { vehicleMake }) {
      try {
        const vehicles = await Vehicle.find({ vehicleMake });
        return vehicles;
      } catch (error) {
        throw new Error(error);
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
        // console.log(vehicleInput);
        const { errors, valid } = validateVehicleInput(vehicleInput);
        // console.log(errors);
        //console.log(valid);
        if (!valid) {
          return new UserInputError("Errors", { errors });
        }
        // console.log(validationResult);
        const newVehicle = new Vehicle({
          ...vehicleInput,
          manufactureYear: Number(vehicleInput.manufactureYear),
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
        const { errors, valid } = validateVehicleInput(vehicleInput);

        if (!valid) {
          return new UserInputError("Errors", { errors });
        }
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
        vehicle.manufactureYear = vehicleInput.manufactureYear
          ? Number(vehicleInput.manufactureYear)
          : Number(vehicle.manufactureYear);
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
    //add favorite vehicle
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
