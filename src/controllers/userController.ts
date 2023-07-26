import {Request,Response} from 'express';
import {User, UserDocument} from "../models/User";

export const getAllUser = async (req:Request, res:Response) => {
    const user = await User.find();
    res.json(user);
}
