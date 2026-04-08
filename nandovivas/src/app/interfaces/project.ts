export interface Project {
    id?: string;
    title: string;
    client: string;
    category?: string;       // campo legacy — se mantiene para migración
    categories?: string[];   // nuevo campo multi-categoría
    image: string;
    description?: string;
    images?: string[];
    credits?: string;
    detailImage?: string;
    altText?: string;
    originalOrder?: number;
    matchesFilter?: boolean;
}
