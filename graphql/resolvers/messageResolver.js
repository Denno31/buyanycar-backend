const { UserInputError } = require("apollo-server");
const mongoose = require("mongoose");
const checkAuth = require("../../utils/checkAuth");
const Message = require("../../models/Message");
const User = require("../../models/User");
const resolvers = {
  Query: {
    async getMessages(_, { fromUser }, context) {
      try {
        const user = checkAuth(context);
        const otherUser = await User.findById(fromUser);
        if (!otherUser) {
          throw new UserInputError("User not found");
        }
        const userIds = [user.id, otherUser._id.toString()];
        //console.log(userIds)
        const messages = await Message.find({
          fromUser: userIds,
          toUser: userIds,
        });
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getChatUsers(_, __, context) {
      try {
        const user = checkAuth(context);
        console.log(user.id);
        let users = [user];
        const allUserMessages = await Message.find({
          $or: [{ fromUser: user.id }, { toUser: user.id }],
        }).sort({ createdAt: -1 });
        console.log(allUserMessages);
        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find((m) => {
            // console.log(typeof m.fromUser);
            // console.log(m.fromUser === mongoose.Types.ObjectId(otherUser.id));
            return (
              m.fromUser.toString() === otherUser.id ||
              m.toUser.toString() === otherUser._id
            );
          });
          otherUser.latestMessage = latestMessage.content;
          return otherUser;
        });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async postMessage(_, { to, content }, context) {
      //console.log("in post message")
      try {
        const user = checkAuth(context);
        const recipient = await User.findById(to);

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (to.toString() === user.id.toString()) {
          throw new UserInputError("You can't message yourself");
        }
        if (content.trim() === "") {
          throw new UserInputError("You cannot send an empty message");
        }
        const message = new Message({
          content,
          fromUser: user.id,
          toUser: to,
        });
        const createdMessage = await message.save();
        return createdMessage;
      } catch (err) {
        // console.log('erro handler')
        throw new Error(err);
      }
    },
  },
};
module.exports = resolvers;
