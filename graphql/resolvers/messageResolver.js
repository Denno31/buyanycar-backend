const { UserInputError } = require('apollo-server')
const checkAuth = require("../../utils/checkAuth");
const Message = require('../../models/Message')
const User = require('../../models/User')
const resolvers = {
    Query:{
        async getMessages(_,{fromUser},context){
            
            try{
                const user = checkAuth(context);
                const otherUser = await User.findById(fromUser)
                if(!otherUser){
                    throw new UserInputError('User not found')
                }
                const userIds = [user.id, otherUser._id.toString()]
                //console.log(userIds)
                const messages = await Message.find({
                    fromUser:userIds,
                    toUser:userIds
                })
                return messages
            }catch(err){
                throw new Error(err)
            }

        }
    },
    Mutation:{
        async postMessage(_,{to,content},context){
            //console.log("in post message")
            try{
                const user = checkAuth(context);
                const recipient = await User.findById(to)

                if(!recipient){
                    throw new UserInputError('User not found')
                }else if(to.toString() === user.id.toString()){
                    throw new UserInputError('You can\'t message yourself')
                }
                if(content.trim()===''){
                    throw new UserInputError('You cannot send an empty message')
                }
                const message = new Message({
                    content,
                    fromUser:user.id,
                    toUser:to,

                })
                const createdMessage = await message.save()
                return createdMessage
            }catch(err){
               // console.log('erro handler')
                throw new Error(err)
            }
        }
    }
}
module.exports = resolvers