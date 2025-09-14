export interface PlantInfo {
    id: number;
    name: string;
    scientificName: string;
    commonNames: string[];
    description: string;
    characteristics: string[];
    uses: string[];
    careInstructions: string;
    nativeRegion: string;
    bloomingSeason: string;
    colors: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    sunlight: 'Full Sun' | 'Partial Sun' | 'Shade';
    watering: 'Low' | 'Medium' | 'High';
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    subfamily?: string;
    genus?: string;
    species?: string;
    clades?: string[];
}

export interface WikipediaInfo {
    title: string;
    description: string;
    extract: string;
    image?: string;
    url: string;
    taxonomy?: {
        kingdom?: string;
        kingdom_alt?: string;
        phylum?: string;
        divisio?: string;
        class?: string;
        classis?: string;
        order?: string;
        order_alt?: string;
        ordo?: string;
        family?: string;
        family_alt?: string;
        familia?: string;
        subfamily?: string;
        subfamilia?: string;
        genus?: string;
        species?: string;
        clades?: string[];
        clade?: string;
        clade1?: string;
        clade2?: string;
        clade3?: string;
    };
}

export interface CompletePlantInfo extends PlantInfo {
    wikipediaInfo?: WikipediaInfo;
    isFromWikipedia?: boolean;
}