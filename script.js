function simulate() {
  const src = document.getElementById('srcIp').value;
  const dst = document.getElementById('dstIp').value;
  const count = parseInt(document.getElementById('packetCount').value);
  const delay = parseInt(document.getElementById('delay').value);
  const type = document.getElementById('trafficType').value;
  const resultDiv = document.getElementById('result');

  if (!src || !dst || isNaN(count) || isNaN(delay)) {
    alert("Please fill all fields correctly.");
    return;
  }

  resultDiv.innerHTML = "⏳ Simulating traffic...";

  fetch("http://localhost:5000/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ src, dst, count, delay, type })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      drawGraph(data.packets);
      resultDiv.innerHTML = `
        <h3>✅ Simulation Complete</h3>
        <p><b>Source:</b> ${src}</p>
        <p><b>Destination:</b> ${dst}</p>
        <p><b>Traffic Type:</b> ${type}</p>
        <p><b>Packets Sent:</b> ${count}</p>
        <p><b>Delay:</b> ${delay} ms</p>
      `;
    } else {
      resultDiv.innerHTML = "❌ Simulation failed.";
    }
  })
  .catch(err => {
    console.error(err);
    resultDiv.innerHTML = "❌ Error connecting to backend.";
  });
}

function drawGraph(data) {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw X and Y axes
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, 280);
  ctx.lineTo(590, 280);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Plot packet data
  ctx.beginPath();
  ctx.moveTo(40, 280);
  data.forEach(point => {
    let x = 40 + parseFloat(point.time) * 50;
    let y = 280 - point.packet * 10;
    ctx.lineTo(x, y);
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
  });
  ctx.strokeStyle = "blue";
  ctx.stroke();
}
