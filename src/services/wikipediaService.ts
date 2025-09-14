/* eslint-disable no-useless-escape */
import { WikipediaInfo } from '../types/flowers';

export async function getWikipediaInfo(plantName: string): Promise<WikipediaInfo | null> {
    try {
        console.log(`Fetching Wikipedia info for: ${plantName}`);

        const cleanName = plantName.replace(/[?]/g, '').trim();

        // Get page summary
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`;
        const summaryResponse = await fetch(summaryUrl);

        if (!summaryResponse.ok) {
            console.warn(`Wikipedia API returned ${summaryResponse.status} for ${plantName}`);
            return null;
        }

        const summaryData = await summaryResponse.json();

        if (summaryData.type === 'disambiguation') {
            console.warn(`${plantName} led to disambiguation page`);
            return null;
        }

        // Get full page content with infobox data
        const pageTitle = summaryData.title;
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&rvprop=content&titles=${encodeURIComponent(pageTitle)}`;

        let taxonomyData = null;
        try {
            const contentResponse = await fetch(contentUrl);
            const contentData = await contentResponse.json();

            if (contentData.query && contentData.query.pages) {
                const pages = Object.values(contentData.query.pages) as any[];
                if (pages.length > 0 && pages[0].revisions) {
                    const wikitext = pages[0].revisions[0]['*'];
                    taxonomyData = extractTaxonomyFromWikitext(wikitext);
                }
            }
        } catch (error) {
            console.warn('Failed to get taxonomy data:', error);
        }

        return {
            title: summaryData.title || plantName,
            description: summaryData.description || '',
            extract: summaryData.extract || 'No description available.',
            image: summaryData.thumbnail?.source,
            url: summaryData.content_urls?.desktop?.page || '',
            taxonomy: taxonomyData
        };
    } catch (error) {
        console.error(`Error fetching Wikipedia info for ${plantName}:`, error);
        return null;
    }
}

function extractTaxonomyFromWikitext(wikitext: string): any {
    const taxonomy: any = {};

    // Patterns for taxonomy data
    const patterns = {
        kingdom: /\|\s*regnum\s*=\s*([^\n\|]+)/i,
        phylum: /\|\s*(phylum|divisio)\s*=\s*([^\n\|]+)/i,
        class: /\|\s*classis\s*=\s*([^\n\|]+)/i,
        order: /\|\s*ordo\s*=\s*([^\n\|]+)/i,
        family: /\|\s*familia\s*=\s*([^\n\|]+)/i,
        subfamily: /\|\s*subfamilia\s*=\s*([^\n\|]+)/i,
        genus: /\|\s*genus\s*=\s*([^\n\|]+)/i,
        species: /\|\s*species\s*=\s*([^\n\|]+)/i,
        // Alternative patterns
        kingdom_alt: /\|\s*kingdom\s*=\s*([^\n\|]+)/i,
        order_alt: /\|\s*order\s*=\s*([^\n\|]+)/i,
        family_alt: /\|\s*family\s*=\s*([^\n\|]+)/i,
        // Clade patterns
        clade: /\|\s*clade\s*=\s*([^\n\|]+)/i,
        clade1: /\|\s*clade1\s*=\s*([^\n\|]+)/i,
        clade2: /\|\s*clade2\s*=\s*([^\n\|]+)/i,
        clade3: /\|\s*clade3\s*=\s*([^\n\|]+)/i,
    };

    // Extract data
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = wikitext.match(pattern);
        if (match && match[1]) {
            let value = match[1].trim();
            // Clean up wiki markup
            value = value.replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, '$1');
            value = value.replace(/'''?([^']+)'''?/g, '$1');
            value = value.replace(/{{[^}]+}}/g, '');
            value = value.trim();

            if (value && value !== '') {
                taxonomy[key] = value;
            }
        }
    }

    // Extract clades array
    const clades = [];
    if (taxonomy.clade1) clades.push(taxonomy.clade1);
    if (taxonomy.clade2) clades.push(taxonomy.clade2);
    if (taxonomy.clade3) clades.push(taxonomy.clade3);
    if (taxonomy.clade && !clades.includes(taxonomy.clade)) clades.push(taxonomy.clade);

    if (clades.length > 0) {
        taxonomy.clades = clades;
    }

    return Object.keys(taxonomy).length > 0 ? taxonomy : null;
}

export async function searchWikipedia(query: string): Promise<string[]> {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&format=json&origin=*`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        return data[1] || [];
    } catch (error) {
        console.error('Error searching Wikipedia:', error);
        return [];
    }
}