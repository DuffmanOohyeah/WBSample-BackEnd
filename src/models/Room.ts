import mongoose from 'mongoose';

export type RoomDocument = mongoose.Document & {
	room_name: string;
	created_at?: Date;
	updated_at?: Date;
};

const roomSchema = new mongoose.Schema<RoomDocument>({
	room_name: {
		type: String,
		unique: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
	},
});

export const Room = mongoose.model<RoomDocument>('Room', roomSchema);
