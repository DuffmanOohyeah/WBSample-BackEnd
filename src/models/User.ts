import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
	user_id: string;
	socket_id?: Array<string>;
	username: string;
	created_at: Date;
};

const userSchema = new mongoose.Schema<UserDocument>({
	user_id: {
		type: String,
	},
	socket_id: [
		{
			type: String,
		},
	],
	username: String,
	created_at: {
		type: Date,
		default: Date.now,
	},
});

export const User = mongoose.model<UserDocument>('User', userSchema);
