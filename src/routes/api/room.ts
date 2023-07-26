import router from 'express';
import * as roomController from './../../controllers/roomController';

export const roomsRouter = router();

roomsRouter.get('/', roomController.getAllRooms);
roomsRouter.post('/', roomController.createRoom);
roomsRouter.get('/:id', roomController.getRoomById);
roomsRouter.put('/:id', roomController.updateRoomById);
roomsRouter.delete('/:id', roomController.deleteRoomById);
