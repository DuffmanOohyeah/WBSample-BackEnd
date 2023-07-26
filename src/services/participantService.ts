import { Pariticipant, ParticipantDoc } from '../models/Participant';
import * as UserService from './userService';
import * as RoomService from './roomSevice';
import mongoose from 'mongoose';

export const AddUserToRoom = async (
	userId: string,
	roomId: string,
	socketId: string
): Promise<ParticipantDoc | null> => {
	const user = await UserService.findUserByUserID(userId);
	const room = await RoomService.getRoomById(roomId);
	return Pariticipant.create({
		user: user,
		room: room,
		socket_id: socketId,
		created_at: new Date(Date.now()),
	});
};
export const removeUserFromRoom = async (
	socketId: string
): Promise<ParticipantDoc | null> => {
	return Pariticipant.findOneAndDelete({ socket_id: socketId });
};

export const gelAllUsersByRoomId = async (
	id: string
): Promise<ParticipantDoc[] | null> => {
	const Id = mongoose.Types.ObjectId(id);
	return Pariticipant.aggregate([
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
			},
		},
	]).exec();
};
