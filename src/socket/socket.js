import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Authentication Middleware for Sockets
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication Error: Token missing'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // attach user info
            next();
        } catch (error) {
            next(new Error('Authentication Error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id} (User: ${socket.user.id})`);

        // Join specific room if requested (e.g. session-specific room)
        socket.on('join-session', (sessionId) => {
            socket.join(`session_${sessionId}`);
            console.log(`User ${socket.user.id} joined session ${sessionId}`);
        });

        // Leave room
        socket.on('leave-session', (sessionId) => {
            socket.leave(`session_${sessionId}`);
            console.log(`User ${socket.user.id} left session ${sessionId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

// Emits an event to a specific session room
export const emitToSession = (sessionId, eventName, data) => {
    if (io) {
        io.to(`session_${sessionId}`).emit(eventName, data);
    }
};

// General broadcast for admin dashboards
export const emitToDashboard = (eventName, data) => {
    if (io) {
        io.emit(eventName, data);
    }
};
