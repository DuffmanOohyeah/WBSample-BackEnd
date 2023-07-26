import { Response } from 'express';
import { User } from '../models/User';

export const getAllUser = async (res: Response) => {
	const user = await User.find();
	res.json(user);
};
