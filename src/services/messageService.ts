import mongoose from 'mongoose';
import { MessageDoc, Message } from '../models/Message';
import * as UserService from './userService';
import * as RoomService from './roomSevice';

export const createMessageInRoom = async (
	userId: string,
	roomId: string,
	message: string
): Promise<MessageDoc> => {
	const user = await UserService.findUserByUserID(userId);
	const room = await RoomService.getRoomById(roomId);
	return Message.create({
		user: user,
		room: room,
		message: message,
		created_at: new Date(Date.now()),
	});
};

export const getAllMessageByRoom = async (roomId: string): Promise<any> => {
	const Id = mongoose.Types.ObjectId(roomId);
	return Message.aggregate([
		{
			$lookup: {
				from: 'rooms',
				localField: 'room',
				foreignField: '_id',
				as: 'Room',
			},
		},
		{
			$unwind: '$Room',
		},
		{
			$match: {
				'Room._id': Id,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'User',
			},
		},
		{
			$unwind: '$User',
		},
		{
			$project: {
				$id: 1,
				username: '$User.username',
				user_id: '$User.user_id',
				text: '$message',
				time: '$created_at',
			},
		},
	]).exec();
};
