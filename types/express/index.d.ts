import { Server } from 'socket.io';

declare module 'express' {
	interface Request {
		io?: Server;
	}
}
