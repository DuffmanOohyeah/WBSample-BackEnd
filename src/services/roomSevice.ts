import {Room, RoomDocument} from "../models/Room";

export const findAll = async(): Promise<RoomDocument[]> => {
    return Room.find().select('room_name created_at updated_at _id');
}

export const create = async(room:RoomDocument):Promise<RoomDocument> => {
    return Room.create(room);
}

export const getRoomById = async(id:string):Promise<RoomDocument | null> => {
    return Room.findById(id);
}

export const updateRoom = async(id:string,room:RoomDocument):Promise<RoomDocument | null> => {
    const newRoom = {...room, updated_at:  new Date(Date.now())}
    return Room.findByIdAndUpdate(id,newRoom,{new:true});
}

export const deleteRoom = async(id:string):Promise<RoomDocument | null> => {
    return Room.findByIdAndRemove(id);
}
