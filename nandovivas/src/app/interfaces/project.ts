export interface Project {
    id?: string;
    title: string;
    client: string;
    category: string;
    image: string;
    description?: string;
    images?: string[];
    credits?: string;
    detailImage?: string;
    originalOrder?: number;
    matchesFilter?: boolean;
}
