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
            const comp = component.trim().toLowerCase();
            if (t === 'item') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_${comp}`;
            } else if (t === 'block') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraft${comp}`;
            } else if (t === 'entity') {
                url = `https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraft${comp}`;
            }
        } else {
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

// ==================== FINAL MARKDOWN PARSER ====================
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
    // Match the exact table format on these pages
    const tableMatch = html.match(/\|\s*Name\s*\|\s*Default Value\s*\|\s*Type\s*\|\s*Description\s*\|\s*\n\s*\|\s*[-:]+\s*\|\s*[-:]+\s*\|\s*[-:]+\s*\|\s*[-:]+\s*\|[\s\S]*?(?=\n\n|\n#|$)/i);

    if (!tableMatch) return [];

    const tableText = tableMatch[0];
    const lines = tableText.trim().split('\n').map(l => l.trim());

    // Extract headers
    const headerLine = lines[0];
    const headers = headerLine.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);

    // Data rows start from line 2
    const dataLines = lines.slice(2);

    return dataLines.map(line => {
        if (!line.startsWith('|')) return null;

        const cells = line.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell.length > 0);

        if (cells.length < 4) return null;

        const obj = {};

        headers.forEach((header, index) => {
            const key = headerMap[header] || header.toLowerCase().replace(/\s+/g, '');
            let value = cells[index] || '';

            value = value.replace(/\*\*/g, '').replace(/\*/g, '').trim();

            if (key === "type" && value) {
                value = typeMap[value] || value;
            }

            obj[key] = value;
        });

        obj.required = false;
        return obj;
    }).filter(Boolean);
}

function parseComponentList(html) {
    // For list pages (you can improve this later if needed)
    const tableMatch = html.match(/\|[\s\S]*?\n\s*\|\s*[-:]+\s*\|[\s\S]*?(?=\n\n|\n#|$)/);
    if (!tableMatch) return [];

    const tableText = tableMatch[0];
    const lines = tableText.trim().split('\n').map(l => l.trim());

    const dataLines = lines.filter(line => line.startsWith('|') && !line.includes('---'));

    return dataLines.map(line => {
        const cells = line.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell.length > 0);

        if (cells.length < 2) return null;

        const nameCell = cells[0];
        const descCell = cells[1];

        const nameMatch = nameCell.match(/minecraft:([\w_]+)/i) || nameCell.match(/\[?([\w:_]+)\]?/i);

        return {
            name: nameMatch ? nameMatch[1] : nameCell.replace(/\[.*?\]/g, '').trim(),
            desc: descCell.replace(/\[.*?\]/g, '').trim(),
            required: false
        };
    }).filter(Boolean);
}