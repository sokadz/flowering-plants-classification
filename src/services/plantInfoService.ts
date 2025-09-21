import { flowerLabels } from '../model/labels';
import { getWikipediaInfo } from './wikipediaService';
import { CompletePlantInfo, PlantInfo } from '../types/flowers';


function extractScientificName(wikipediaInfo: any): string | null {
    // Try to get from taxonomy first
    if (wikipediaInfo.taxonomy?.species) {
        return wikipediaInfo.taxonomy.species;
    }

    // Try to extract from title if in scientific format (Genus species)
    const title = wikipediaInfo.title;
    if (title && /^[A-Z][a-z]+ [a-z]+/.test(title)) {
        return title;
    }

    // Try to extract from description 
    const description = wikipediaInfo.extract || '';

    // Look for scientific name pattern in italics or binomial nomenclature
    const scientificMatch = description.match(/\b[A-Z][a-z]+ [a-z]+(?:\s+[a-z]+)?\b/);
    if (scientificMatch) {
        const candidate = scientificMatch[0];
        // Make sure it's not starting with common words OR containing "was", "is", etc.
        if (!candidate.match(/^(The|This|It|Species|Genus|Family)/i) &&
            !candidate.match(/\s+(was|is|are|were|a|an|the)\s+/i)) {
            return candidate;
        }
    }

    return null;
}

function extractSpeciesName(wikipediaInfo: any): string | null {
    // First try to get from taxonomy
    if (wikipediaInfo.taxonomy?.species) {
        const fullSpecies = wikipediaInfo.taxonomy.species;
        // Extract just the species part (after genus)
        const parts = fullSpecies.split(' ');
        if (parts.length >= 2) {
            // Clean up species name - remove "was a" and similar
            let speciesName = parts.slice(1).join(' ');
            speciesName = speciesName.replace(/\s+(was|is|are|were|a|an|the).*$/i, '').trim();
            return speciesName;
        }
    }

    // Try to extract from scientific name
    const scientificName = extractScientificName(wikipediaInfo);
    if (scientificName) {
        const parts = scientificName.split(' ');
        if (parts.length >= 2) {
            let speciesName = parts.slice(1).join(' ');
            // Clean up - remove descriptive text
            speciesName = speciesName.replace(/\s+(was|is|are|were|a|an|the).*$/i, '').trim();
            return speciesName;
        }
    }

    // Try to extract from title
    const title = wikipediaInfo.title;
    if (title && /^[A-Z][a-z]+ [a-z]+/.test(title)) {
        const parts = title.split(' ');
        if (parts.length >= 2) {
            let speciesName = parts.slice(1).join(' ');
            speciesName = speciesName.replace(/\s+(was|is|are|were|a|an|the).*$/i, '').trim();
            return speciesName;
        }
    }

    return null;
}

function extractGenus(wikipediaInfo: any): string | null {
    // From taxonomy
    if (wikipediaInfo.taxonomy?.genus) {
        return wikipediaInfo.taxonomy.genus;
    }

    // From scientific name
    const scientificName = extractScientificName(wikipediaInfo);
    if (scientificName) {
        return scientificName.split(' ')[0];
    }

    // From title
    const title = wikipediaInfo.title;
    if (title && /^[A-Z][a-z]+/.test(title)) {
        return title.split(' ')[0];
    }

    return null;
}

// Update main function
export async function getCompletePlantInfo(classId: number): Promise<CompletePlantInfo | null> {
    try {
        // Get flower name from labels
        const flowerName = flowerLabels[classId];

        if (!flowerName) {
            console.log(`No flower name found for class ${classId}`);
            return getDefaultPlantInfo(classId);
        }

        console.log(`Fetching all data from Wikipedia for: ${flowerName}`);

        // Get all info from Wikipedia
        const wikipediaInfo = await getWikipediaInfo(flowerName);

        if (wikipediaInfo && wikipediaInfo.extract && wikipediaInfo.extract.length > 50) {
            console.log(`Successfully fetched Wikipedia data for: ${flowerName}`);

            // Extract scientific naming properly
            const scientificName = extractScientificName(wikipediaInfo) || wikipediaInfo.title || "Scientific name not available";
            const genus = extractGenus(wikipediaInfo);
            const species = extractSpeciesName(wikipediaInfo);
            const clades = extractCladesFromWikipedia(wikipediaInfo);

            // Create complete plant info from Wikipedia
            const plantInfoFromWikipedia: PlantInfo = {
                id: classId,
                name: capitalizeWords(flowerName),
                scientificName: scientificName,
                commonNames: [capitalizeWords(flowerName)],
                description: wikipediaInfo.extract,
                characteristics: extractCharacteristics(wikipediaInfo.extract),
                uses: extractUses(wikipediaInfo.extract),
                careInstructions: "Please consult local gardening experts for specific care instructions.",
                nativeRegion: extractNativeRegion(wikipediaInfo.extract),
                bloomingSeason: "Seasonal",
                colors: extractColors(flowerName, wikipediaInfo.extract),
                difficulty: "Medium" as const,
                sunlight: "Partial Sun" as const,
                watering: "Medium" as const,
                kingdom: wikipediaInfo.taxonomy?.kingdom || wikipediaInfo.taxonomy?.kingdom_alt || 'Plantae',
                phylum: wikipediaInfo.taxonomy?.phylum || wikipediaInfo.taxonomy?.divisio,
                class: wikipediaInfo.taxonomy?.class || wikipediaInfo.taxonomy?.classis,
                order: wikipediaInfo.taxonomy?.order || wikipediaInfo.taxonomy?.order_alt || wikipediaInfo.taxonomy?.ordo,
                family: wikipediaInfo.taxonomy?.family || wikipediaInfo.taxonomy?.family_alt || wikipediaInfo.taxonomy?.familia,
                subfamily: wikipediaInfo.taxonomy?.subfamily || wikipediaInfo.taxonomy?.subfamilia,
                genus: genus || undefined,
                species: species || undefined,
                clades: clades
            };

            console.log('taneman', wikipediaInfo);


            return {
                ...plantInfoFromWikipedia,
                wikipediaInfo,
                isFromWikipedia: true
            };
        }

        console.log(`No sufficient Wikipedia data for: ${flowerName}, using default info`);
        return getDefaultPlantInfo(classId);


    } catch (error) {
        console.error(`Error getting plant info for class ${classId}:`, error);
        return getDefaultPlantInfo(classId);
    }
}

function extractUses(description: string): string[] {
    const uses: string[] = [];

    // Default uses
    uses.push("Ornamental");

    // Extract from description
    if (description.toLowerCase().includes('medicinal')) uses.push('Medicinal');
    if (description.toLowerCase().includes('culinary') || description.toLowerCase().includes('edible')) uses.push('Culinary');
    if (description.toLowerCase().includes('perfume') || description.toLowerCase().includes('fragrance')) uses.push('Perfume');
    if (description.toLowerCase().includes('tea')) uses.push('Tea');
    if (description.toLowerCase().includes('cut flower')) uses.push('Cut flowers');
    if (description.toLowerCase().includes('garden')) uses.push('Garden decoration');
    if (description.toLowerCase().includes('landscaping')) uses.push('Landscaping');

    return uses.length > 1 ? uses : ["Ornamental", "Garden decoration"];
}

function extractNativeRegion(description: string): string {
    // extract region from description
    const regions = [
        'Asia', 'Europe', 'Africa', 'America', 'Australia', 'Mediterranean',
        'China', 'Japan', 'India', 'Mexico', 'Brazil', 'North America',
        'South America', 'tropical', 'subtropical', 'temperate'
    ];

    for (const region of regions) {
        if (description.toLowerCase().includes(region.toLowerCase())) {
            return region.charAt(0).toUpperCase() + region.slice(1);
        }
    }

    return "Various regions";
}

function extractColors(flowerName: string, description: string = ''): string[] {
    const colorMap: { [key: string]: string } = {
        'pink': 'Pink',
        'red': 'Red',
        'yellow': 'Yellow',
        'white': 'White',
        'purple': 'Purple',
        'blue': 'Blue',
        'orange': 'Orange',
        'violet': 'Violet',
        'lavender': 'Lavender',
        'crimson': 'Red',
        'scarlet': 'Red'
    };

    const foundColors: string[] = [];

    // Check flower name
    Object.keys(colorMap).forEach(color => {
        if (flowerName.toLowerCase().includes(color)) {
            foundColors.push(colorMap[color]);
        }
    });

    // Check description
    Object.keys(colorMap).forEach(color => {
        if (description.toLowerCase().includes(color) && !foundColors.includes(colorMap[color])) {
            foundColors.push(colorMap[color]);
        }
    });

    return foundColors.length > 0 ? foundColors : ['Various'];
}

function extractCharacteristics(description: string): string[] {
    const characteristics: string[] = [];

    // Size characteristics
    if (description.toLowerCase().includes('large')) characteristics.push('Large flowers');
    if (description.toLowerCase().includes('small')) characteristics.push('Small flowers');
    if (description.toLowerCase().includes('tiny')) characteristics.push('Small flowers');
    if (description.toLowerCase().includes('tall')) characteristics.push('Tall growth');
    if (description.toLowerCase().includes('dwarf') || description.toLowerCase().includes('compact')) characteristics.push('Compact size');

    // Growth characteristics
    if (description.toLowerCase().includes('climbing')) characteristics.push('Climbing habit');
    if (description.toLowerCase().includes('trailing')) characteristics.push('Trailing habit');
    if (description.toLowerCase().includes('spreading')) characteristics.push('Spreading growth');
    if (description.toLowerCase().includes('upright')) characteristics.push('Upright growth');

    // Flower characteristics
    if (description.toLowerCase().includes('fragrant') || description.toLowerCase().includes('scented')) characteristics.push('Fragrant flowers');
    if (description.toLowerCase().includes('double')) characteristics.push('Double flowers');
    if (description.toLowerCase().includes('single')) characteristics.push('Single flowers');

    // Plant type
    if (description.toLowerCase().includes('perennial')) characteristics.push('Perennial plant');
    if (description.toLowerCase().includes('annual')) characteristics.push('Annual plant');
    if (description.toLowerCase().includes('biennial')) characteristics.push('Biennial plant');
    if (description.toLowerCase().includes('shrub')) characteristics.push('Shrub');
    if (description.toLowerCase().includes('tree')) characteristics.push('Tree');
    if (description.toLowerCase().includes('herb')) characteristics.push('Herbaceous plant');

    // Special features
    if (description.toLowerCase().includes('thorns') || description.toLowerCase().includes('spines')) characteristics.push('Thorny stems');
    if (description.toLowerCase().includes('succulent')) characteristics.push('Succulent');
    if (description.toLowerCase().includes('evergreen')) characteristics.push('Evergreen');
    if (description.toLowerCase().includes('deciduous')) characteristics.push('Deciduous');

    return characteristics.length > 0 ? characteristics : ['Beautiful flowers'];
}


function getDefaultClades(): string[] {
    return [];
}

// Update extract clades from wikipedia
function extractCladesFromWikipedia(wikipediaInfo: any): string[] {
    // Priority: dari taxonomy clades Wikipedia
    if (wikipediaInfo.taxonomy?.clades && Array.isArray(wikipediaInfo.taxonomy.clades)) {
        return wikipediaInfo.taxonomy.clades;
    }

    // Fallback: extract from infobox or description
    const description = wikipediaInfo.extract || '';
    const clades: string[] = [];

    // Common plant clades patterns
    const cladePatterns = [
        /Tracheophytes/gi,
        /Angiosperms/gi,
        /Eudicots/gi,
        /Monocots/gi,
        /Asterids/gi,
        /Rosids/gi,
        /Commelinids/gi
    ];

    cladePatterns.forEach(pattern => {
        const matches = description.match(pattern);
        if (matches) {
            matches.forEach((match: string) => {
                const clade = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                if (!clades.includes(clade)) {
                    clades.push(clade);
                }
            });
        }
    });

    return clades.length > 0 ? clades : ['Tracheophytes', 'Angiosperms'];
}

function getDefaultPlantInfo(classId: number): CompletePlantInfo {
    const flowerName = flowerLabels[classId] || "Unknown Flower";

    return {
        id: classId,
        name: capitalizeWords(flowerName),
        scientificName: "Scientific name not available",
        commonNames: [capitalizeWords(flowerName)],
        description: `${capitalizeWords(flowerName)} is a beautiful flower. Detailed information is not currently available.`,
        characteristics: ["Beautiful flowers", "Natural beauty"],
        uses: ["Ornamental", "Garden decoration"],
        careInstructions: "Please consult local gardening experts for care instructions.",
        nativeRegion: "Various regions",
        bloomingSeason: "Seasonal",
        colors: extractColors(flowerName),
        difficulty: "Medium" as const,
        sunlight: "Partial Sun" as const,
        watering: "Medium" as const,
        kingdom: 'Plantae',
        clades: getDefaultClades(),
        isFromWikipedia: false
    };
}

function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function getFlowerName(classId: number): string {
    return capitalizeWords(flowerLabels[classId] || "Unknown Flower");
}