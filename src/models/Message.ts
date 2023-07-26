import mongoose, {SchemaType} from 'mongoose';
import {UserDocument} from "./User";
import {RoomDocument} from "./Room";

export type MessageDoc = mongoose.Document & {
    user: UserDocument,
    room: RoomDocument,
    message:String;
    created_at ?: Date,
}

const messageSchema = new mongoose.Schema<MessageDoc>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    message: {
        type: String
    },
    created_at: {
        type: Date,
        Default: Date.now
    }
})

export const Message = mongoose.model<MessageDoc>("Message",messageSchema);
