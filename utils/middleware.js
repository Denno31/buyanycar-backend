
module.exports.checkOwner=(userId,ownerId)=>{
    return ownerId.toString() === userId.toString()
}