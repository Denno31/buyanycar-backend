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
          users: { $all: userIds },
        }).sort({ createdAt: 1 });
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
  
    async getChatUsers(_, __, context) {
      try {
        const user = checkAuth(context);
        console.log(user.id);
        let chats = []
        let userList = await User.find({_id:{$ne:user.id}}).select('firstName lastName _id')
        const messages = await Message.find().sort({createdAt:-1})

        for(let i=0; i < userList.length; i++){
          const latestMsg = messages.find(msg=>{
            return (msg.users.includes(userList[i]._id.toString()) && msg.users.includes(user.id.toString()))
          })
          userList[i].latestMessage = latestMsg?.content
          userList[i].id = userList[i]._id
          if(latestMsg)
          chats.push(userList[i])
        }
         console.log("the chats", chats);
        return chats;
      } catch (err) {
        console.log(err)
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async postMessage(_, { to, content }, context) {
      //console.log("in post message");
     
      try {
        const user = checkAuth(context);
        // console.log(user);
        const recipient = await User.findById(to);
        // console.log(recipient);
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
          users: [user.id, to],
        });
        const createdMessage = await message.save();
        context.pubsub.publish('NEW_MESSAGE',{newMessage:createdMessage})
        return createdMessage;
      } catch (err) {
        // console.log('erro handler')
        
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newMessage:{
      subscribe:(_,__,{pubsub})=> {
        console.log("in sub")
        return pubsub.asyncIterator('NEW_MESSAGE')}
    }
  }
};
module.exports = resolvers;
