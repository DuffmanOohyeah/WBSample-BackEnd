import { Request, Response } from 'express';
import { RoomDocument } from '../models/Room';
import * as RoomService from './../services/roomSevice';

export const getAllRooms = async (res: Response): Promise<void> => {
	try {
		const rooms: RoomDocument[] = await RoomService.findAll();
		res.status(200).json(rooms);
	} catch (err: any) {
		res.status(500).json(err.message);
	}
};

export const createRoom = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const room: RoomDocument = req.body;
		const newRoom = await RoomService.create(room);
		res.status(201).json(newRoom);
	} catch (err: any) {
		res.status(500).json(err.message);
	}
};

export const getRoomById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const id: string = req.params.id;
		const room = await RoomService.getRoomById(id);
		res.status(201).json(room);
	} catch (err: any) {
		res.status(500).json(err.message);
	}
};

export const updateRoomById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const id: string = req.params.id;
		const room: RoomDocument = req.body;
		const updatedRoom = await RoomService.updateRoom(id, room);
		res.status(200).json(updatedRoom);
	} catch (err: any) {
		res.status(500).json(err.message);
	}
};

export const deleteRoomById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const id: string = req.params.id;
		const deletedRoom = await RoomService.deleteRoom(id);
		if (!deletedRoom) {
			res.status(404).json({ message: 'room has not found' });
		} else {
			res.status(200).json(deletedRoom);
		}
	} catch (err: any) {
		res.status(500).json(err.message);
	}
};
