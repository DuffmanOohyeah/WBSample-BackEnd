import {Request,Response} from 'express';
import * as messageService from './../services/messageService';

export const sendMessageToRoom =  async (req:Request, res:Response):Promise<void> => {
    const io = req.io;
    const {user_id, room_id, message} = req.body
    try{
        const newMessage = await messageService.createMessageInRoom(user_id,room_id,message);
        io?.sockets.in(room_id).emit('message',{username:newMessage.user.username,text:newMessage.message,time:newMessage.created_at});
        res.status(200).json(newMessage);
    } catch (e) {
        res.status(500).json(e.message)
    }
}

export const getAllMessagesFromRoom = async (req:Request, res:Response):Promise<void> => {
     const roomId:string = req.params.id;
    try{
        const Messages = await messageService.getAllMessageByRoom(roomId);
        res.status(200).json(Messages);
    } catch (e) {
        res.status(500).json(e.message)
    }
}
