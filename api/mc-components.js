export default function handler(req, res) {
    // Get values from the URL query string
    const { type, component } = req.query;

    const data = {
        success: true,
        type: type || null,
        component: component || null,
        timestamp: new Date().toISOString(),
        message: "Minecraft component API response",
        // Add your actual logic here later
    };

  res.status(200).json(data);
}