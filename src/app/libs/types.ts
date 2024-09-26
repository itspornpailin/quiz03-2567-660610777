import { Room, Message, User } from "./DB";

export interface Database {
    rooms: Room[];
    messages: Message[];
    users: User[];
}

export interface Payload {
    username: string;
    role: string;
}