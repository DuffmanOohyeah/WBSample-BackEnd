import router ,{Request,Response} from "express"
import * as MessageController from "./../../controllers/messageController";

export const messagesRouter = router();

messagesRouter.post('/',MessageController.sendMessageToRoom);
messagesRouter.get('/:id',MessageController.getAllMessagesFromRoom);
