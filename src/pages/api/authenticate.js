export default function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { key } = req.body;
    const correctKey = process.env.DASHBOARD_ACCESS_KEY;
    console.log(key, correctKey)
    if (key == correctKey) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Key" });
    }
}
