const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/simulate", (req, res) => {
  const { src, dst, count, delay, type } = req.body;

  if (!src || !dst || !count || !delay || !type) {
    return res.status(400).json({ success: false, message: "Missing input" });
  }

  const packets = [];

  for (let i = 0; i < count; i++) {
    packets.push({
      packet: i + 1,
      time: (i * delay / 1000).toFixed(2),
      src,
      dst,
      type
    });
  }

  res.json({
    success: true,
    packets,
    message: "Simulation complete"
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
