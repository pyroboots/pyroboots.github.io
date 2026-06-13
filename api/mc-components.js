export default async function handler(req, res) {
    const { type, component } = req.query;

    if (!type || !['block', 'item', 'entity'].includes(type.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: "Invalid or missing 'type' query. Must be 'block', 'item', or 'entity'.",
            type: type || null,
            component: component || null
        });
    }

    const t = type.toLowerCase();

    try {
        let url;

        if (component && component.trim() !== '') {
            // component
            const comp = component.trim().toLowerCase();
            if (t === 'item') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_${comp}`;
            } else if (t === 'block') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraft${comp}`;
            } else if (t === 'entity') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraft${comp}`;
            }
        } else {
            // list
            if (t === 'item') {
                url = 'https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponentlist';
            } else if (t === 'block') {
                url = 'https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/blockcomponentslist';
            } else if (t === 'entity') {
                url = 'https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/componentlist';
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`);
        }

        const html = await response.text();
        const data = parseMinecraftPage(html, !component || component.trim() === '');

        res.status(200).json({
            success: true,
            type: t,
            component: component || null,
            data: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

function parseMinecraftPage(html, isListPage) {
    if (isListPage) {
        return parseComponentList(html);
    } else {
        return parseComponentProperties(html);
    }
}

const headerMap = {
    "Name": "name",
    "Default Value": "default",
    "Type": "type",
    "Description": "desc"
};

const typeMap = {
    "Boolean true/false": "bool",
    "boolean": "bool",
    "Boolean": "bool",
    "true/false": "bool",
    "string": "string",
    "number": "number",
    "integer": "int",
    "int": "int",
    "float": "float",
    "array": "array",
    "object": "object",
};

function parseComponentProperties(html) {
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);
    if (!tableMatch) return [];

    const tableHtml = tableMatch[0];

    // get headers safely
    let headers = [];
    const headerMatch = tableHtml.match(/<thead>[\s\S]*?<\/thead>/i) || tableHtml;
    const thMatches = headerMatch.match(/<th[^>]*>(.*?)<\/th>/gi);

    if (thMatches) {
        headers = thMatches.map(th => 
            th.replace(/<[^>]+>/g, '').trim()
        );
    }

    if (headers.length === 0) {
        headers = ["Name", "Default Value", "Type", "Description"];
    }

    const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>[\s\S]*?<\/tr>/gi)].slice(1);

    return rowMatches.map(rowMatch => {
        const rowHtml = rowMatch[0];
        const cellMatches = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];

        const obj = {};

        headers.forEach((header, index) => {
            const key = headerMap[header] || header.toLowerCase().replace(/\s+/g, '');
            let value = cellMatches[index] 
                ? cellMatches[index].replace(/<[^>]+>/g, '').trim() 
                : '';

            if (key === "type" && value) {
                value = typeMap[value] || value;
            }

            obj[key] = value;
        });

        obj.required = false;
        return obj;
    });
}

function parseComponentList(html) {
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);
    if (!tableMatch) return [];

    const tableHtml = tableMatch[0];
    const rows = [...tableHtml.matchAll(/<tr[^>]*>[\s\S]*?<\/tr>/gi)].slice(1);

    return rows.map(rowMatch => {
        const rowHtml = rowMatch[0];
        const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];

        if (cells.length < 2) return null;

        const nameCell = cells[0];
        const descCell = cells[1];

        const nameMatch = nameCell.match(/minecraft:([\w_]+)/i) || nameCell.match(/\[?([\w:_]+)\]?/i);

        return {
            name: nameMatch 
                ? nameMatch[1] 
                : nameCell.replace(/<[^>]+>/g, '').trim(),
            desc: descCell.replace(/<[^>]+>/g, '').trim(),
            required: false
        };
    }).filter(Boolean);
}