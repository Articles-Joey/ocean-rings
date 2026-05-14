// import { create } from "zustand";
import { createWithEqualityFn as create } from 'zustand/traditional'
import { io } from "socket.io-client";

export const useSocketStore = create((set) => ({
    // socket: null,
    socket: io({
        autoConnect: false
    }),
    serverUrl: process.env.NEXT_PUBLIC_NODE_SERVER, // Default server URL
    connectSocket: (url) => {
        // console.log("[📶Socket] connectSocket called")
        const newSocket = io(url || process.env.NEXT_PUBLIC_NODE_SERVER, {
            transports: ["websocket"],
            autoConnect: false,
            reconnection: true,
            reconnectionDelay: 5000,
            reconnectionDelayMax: 10000,
            query: {
                "client": "ocean-rings"
            },
        });
        newSocket.connect();
        set({ socket: newSocket });
    },
    setServerUrl: (url) => set({ serverUrl: url }),
    disconnectSocket: () => set((state) => {
        state.socket?.disconnect();
        return {}
        // Disconnect but do not dump socket store or socket.on and socket.connected will be undefined if not careful
        // return { socket: null };
    }),
    startGame: (gameId, status) => {
        set((state) => {
            state.socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:start`, {
                game_id: gameId,
                status: status
            });
            return {}
        })
    },
    totalUsers: 0,
    setTotalUsers: (total) => set({ totalUsers: total }),
    connected: false,
    setConnected: (total) => set({ connected: total }),
    authenticated: false,
    setAuthenticated: (value) => set({ authenticated: value }),
    loginSocket: (data) => {
        set((state) => {
            const socket = state.socket;
            socket.emit('login-socket', {
                ...data,
                game_name: process.env.NEXT_PUBLIC_GAME_NAME,
            });
            return {}
        })
    },
}));