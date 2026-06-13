export default async function handler(req, res) {
    const { segments } = req.query;

    const type = segments[0] || null;
    const value = segments[1] || null;

    const data = {
        success: true,
        type: type,
        value: value,
        fullPath: segments ? segments.join("/") : "",
        message: `Minecraft component data for ${type}/${value}`,
        timestamp: new Date().toISOString(),
    };

    res.status(200).json(data);
}