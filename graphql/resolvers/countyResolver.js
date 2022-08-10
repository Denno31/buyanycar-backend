const County = require("../../models/County");
const SubCounty = require("../../models/SubCounty");
const countiesData = require("../../counties");
const { subCounties: subCountiesData } = require("../../subCounties");
const resolvers = {
  Query: {
    hello() {
      return "hello";
    },
    async getCounties() {
      try {
        const counties = await County.find();

        return counties;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getSubCounties(_, { countyName }) {
      try {
        const subCounties = await SubCounty.find({ name: countyName });
        return subCounties;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // seed counties
    async seedCounties() {
      const counties = await County.insertMany(countiesData.counties);
      return "success";
    },
    async seedSubCounties() {
      const subCounties = await SubCounty.insertMany(
        subCountiesData.result.records
      );
      //console.log(subCounties.result.records);
      return "success";
    },
  },
};

module.exports = resolvers;
