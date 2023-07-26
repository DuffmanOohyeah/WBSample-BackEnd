import path from 'path';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
//import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
const publicRoutes: any = require('./routes/public/_routes'); //(app);
const privateRoutes: any = require('./routes/private/_routes'); //(app);
import * as userController from './controllers/userController';
import * as ParticipantService from './services/participantService';
import * as UserService from './services/userService';
import { createServer } from 'http';
import { Socket, Server } from 'socket.io';
import { roomsRouter } from './routes/api/room';
import { messagesRouter } from './routes/api/message';
import { Pariticipant } from './models/Participant';

//config enviroment variable
dotenv.config({ path: '.env' });
//create Express server
const app = express();
const server: any = createServer(app);

const mongoUrl: string = process.env.MONGODB_URI_LOCAL ?? ' ';
//connect with mongoDB
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('MongoDB connection is successful');
	})
	.catch((err) => {
		console.log(
			`MongoDB connection error. Please make sure MongoDB is running. ${err}`
		);
		// process.exit();
	});

/* start: handle cors */
const corsOptions: any = {
	origin: '*',
	methods: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'],
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
/* end: handle cors */

/* start: handle body/cookie parser */
const parserOptions: any = {
	extended: false,
	inflate: true,
	limit: '100kb',
	parameterLimit: 1000,
	type: 'application/x-www-form-urlencoded',
};

app.use(bodyParser.urlencoded(parserOptions)); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
/* end: handle body/cookie parser */

/* start: handle compression & routing */
app.use(compression());
app.use(express.static(path.join(__dirname, './../static/'))); // server static files (e.g. htm, jpg, css etc.) via this dir

/* start: setup socket user vars */
const userSocketIdMap: any = new Map(); // a map of online usernames and their clients
//let userName: string = 'Anonymous_' + uuidv4().slice(0, 3);
/* end: setup socket user vars */

/* start: write some custom fns() */
const addClientToMap: any = (userName: string, socketId: string) => {
	if (!userSocketIdMap.has(userName)) {
		// when user is joining first time
		userSocketIdMap.set(userName, new Set([socketId]));
	} else {
		// user had already joined from one client and now joining using another client
		userSocketIdMap.get(userName).add(socketId);
	}
};

const removeClientFromMap: any = (userName: string, socketId: string) => {
	if (userSocketIdMap.has(userName)) {
		let userSocketIdSet: any = userSocketIdMap.get(userName);
		userSocketIdSet.delete(socketId);
		// if there are no clients for a user, remove that user from online list (map)
		if (userSocketIdSet.size == 0) {
			userSocketIdMap.delete(userName);
		}
	}
};

const getClientsFromMap: any = (map: any, collection: string) => {
	const rtn: any[] = [];

	switch (collection) {
		case 'keys':
			for (let key of map.keys()) {
				rtn.push(key);
			}
			break;
		case 'values':
			for (let val of map.values()) {
				rtn.push(val);
			}
			break;
		default:
			for (let [key, value] of map.entries()) {
				rtn.push({ userName: key, socketId: value });
			}
			break;
	}

	return rtn;
};
/* end: write some custom fns() */

/* start: server for socket io */
const sio: Server = new Server(server, {
	cors: corsOptions,
	perMessageDeflate: false,
	transports: ['websocket'],
});

const onSioConnection: any = () => {
	sio.on('connection', async (socket: Socket) => {
		const data = JSON.parse(JSON.stringify(socket.handshake.query));
		const user = await UserService.addSocketInfoToUser({
			user_id: data.user_id,
			socket_id: socket.id,
			username: data.username,
		});
		socket.join(data.room_id);
		await ParticipantService.AddUserToRoom(
			data.user_id,
			data.room_id,
			socket.id
		);
		if (user !== null) {
			socket.emit('message', {
				username: user.username,
				text: 'welcome to chat',
				time: Date.now(),
			});
		}
		const users = await ParticipantService.gelAllUsersByRoomId(data.room_id);
		sio.to(data.room_id).emit('roomUsers', { room: '', users: users });
		socket.on('disconnect', async () => {
			const user = await UserService.removeSocketInfoFromUser(socket.id);
			const participant = await ParticipantService.removeUserFromRoom(
				socket.id
			);
			const users = await ParticipantService.gelAllUsersByRoomId(data.room_id);
			sio.to(data.room_id).emit('roomUsers', { room: '', users: users });
		});
	});
};

// add socket io as
app.use(function (req: Request, res: Response, next) {
	req.io = sio;
	next();
});
/* end: server for socket io */

/**
 * API examples routes.
 */

app.use(['/public'], publicRoutes);
app.use(['/admin', '/cms', '/private'], privateRoutes);
app.get('/api/user', userController.getAllUser);
app.get('/api/participant', async (_, res: Response) => {
	const paticipants = await Pariticipant.find()
		.populate('room')
		.populate('user')
		.exec();
	res.json(paticipants);
});
app.use('/api/room', roomsRouter);
app.use('/api/message', messagesRouter);
app.use((req: any, res: any) => {
	res.status(404).send("Sorry we've looked, but can't find that endpoint.");
});
/* end: handle compression & routing */
/* start: output generic server info */
const serverInfo: any = () => {
	console.log(`~~~~~`);
	console.log(`Platform: ${process.platform}`);
	console.log(`Node version: ${process.version}`);
	console.log(`Current working dir: ${process.cwd()}`);
	if (process.env.OS) {
		console.log(`OS: ${process.env.OS}`);
	}
	if (process.env.PROCESSOR_ARCHITECTURE) {
		console.log(
			`Processor architecture: ${process.env.PROCESSOR_ARCHITECTURE}`
		);
	}
	if (process.env.PROCESSOR_IDENTIFIER) {
		console.log(`Processor identifier: ${process.env.PROCESSOR_IDENTIFIER}`);
	}
	if (process.env.NUMBER_OF_PROCESSORS) {
		console.log(`Number of processors: ${process.env.NUMBER_OF_PROCESSORS}`);
	}
	console.log(`~~~~~`);
	return null;
};
/* end: output generic server info */

/* start: assign ports to server */
const assignPorts: any = () => {
	server.listen(process.env.PORT);
	console.log(
		`Worker PID ${process.pid} says ... the ${process.env.NODE_ENV} server is running on port ${process.env.PORT}.`
	);
};
/* end: assign ports to server */

assignPorts();
serverInfo();
onSioConnection();

export default app;
