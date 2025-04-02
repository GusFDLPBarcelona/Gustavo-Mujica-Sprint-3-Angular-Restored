export interface Project {
    id?: number;
    title: string;
    client: string;
    category: string;
    image: string;
    originalOrder?: number;
    matchesFilter?: boolean;
}
