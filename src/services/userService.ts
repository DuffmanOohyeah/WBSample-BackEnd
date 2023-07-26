import {User,UserDocument} from "../models/User";

interface SocketInfo {
    user_id:string,
    username:string,
    socket_id:string,
}

export const createUser = async(user:any):Promise<UserDocument> => {
    return User.create(user);
}

export const findUserByUserID = async(id:string):Promise<UserDocument | null> => {
    return User.findOne({user_id:id});
}
export const addSocketInfoToUser = async(socketInfo:SocketInfo):Promise<UserDocument| null> => {
     const user = await findUserByUserID(socketInfo.user_id);
     if(!user){
        return await createUser({user_id: socketInfo.user_id,
            username: socketInfo.username,
            socket_id:[socketInfo.socket_id],
            created_at: new Date(Date.now())});
     }
     return User.findOneAndUpdate({user_id: user.user_id}, {$push: {socket_id: socketInfo.socket_id}});
}

export const removeSocketInfoFromUser = async(socketId:string):Promise<UserDocument| null> => {
    return User.findOneAndUpdate({socket_id:{"$in":[socketId]}},{$pull:{socket_id:socketId}},{multi:true,new:true});
}
