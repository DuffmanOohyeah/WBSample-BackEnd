import mongoose, {SchemaType} from 'mongoose';
import {UserDocument} from "./User";
import {RoomDocument} from "./Room";

export type ParticipantDoc = mongoose.Document & {
    user: UserDocument,
    room: RoomDocument
    socket_id?:string,
    created_at ?: Date,
}

const participantSchema = new mongoose.Schema<ParticipantDoc>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    socket_id: {
        type:String,
    },
    created_at: {
        type: Date,
        Default: Date.now
    }
})

export const Pariticipant = mongoose.model<ParticipantDoc>("Participant",participantSchema);
