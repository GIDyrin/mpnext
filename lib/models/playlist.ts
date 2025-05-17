import { Track } from "./track";

export type Playlist = {
    id: number;
    name: string;
    track_count: number; 
    is_system: boolean;
    created_at: string;
    user_id: number;
};


export type PlaylistDetailed = {
    id: number;
    user: number;
    name: string;
    tracks: Track[];  
    is_system: boolean;
    created_at: string;
};