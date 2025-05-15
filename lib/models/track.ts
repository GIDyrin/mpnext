export type Track = {
    id: number;
    title: string;
    artist: string;
    duration: number;
    original_file: string;
    hls_playlist?: string;
    created_at: string;
    user_id: number;
}