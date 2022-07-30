const Vehicle = require("../../models/Vehicle");
const checkAuth = require("../../utils/checkAuth");
const { vehicleSchema } = require("../../utils/validators");

const resolvers = {
  Query: {
    //get vehicles
    async getVehicles() {
      try {
        const vehicles = await Vehicle.find().populate("vehicleOwner");
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
  },
  // vehicle mutations
  Mutation: {
    async postVehicle(parent, { vehicleInput }, context) {
      const user = checkAuth(context);

      try {
        const validationResult = await vehicleSchema.validateAsync(
          vehicleInput
        );
        // console.log(validationResult);
        const newVehicle = new Vehicle({
          ...vehicleInput,
          vehicleOwner: user.id,
        });

        const vehicle = await newVehicle.save();
        return vehicle;
      } catch (err) {
        console.log(err);
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
  },
};
module.exports = resolvers;
