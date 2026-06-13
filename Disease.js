// Retrieve current user
const currentUserStr = localStorage.getItem('currentUser');
const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

document.getElementById("predictBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("imageInput");
  const resultBox = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please select an image first.");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image", file);
  
  if (currentUser) {
    formData.append("userId", currentUser.id);
  }

  resultBox.innerHTML = `
      <div style="text-align: center; padding: 20px;">
          <p style="font-weight: bold; color: #2e7d32;">⏳ Uploading image and analyzing with Gemini AI...</p>
      </div>
  `;

  try {
    const response = await fetch('/api/farming/predict-disease', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      resultBox.innerText = "❌ Error: " + (data.error || "Failed to analyze image");
      return;
    }

  const prediction = JSON.parse(data.prediction);

const disease =
  prediction.result?.disease?.suggestions?.[0];

const crop =
  prediction.result?.crop?.suggestions?.[0];

if (!disease) {
  resultBox.innerHTML = `
    <div class="alert alert-warning">
      No disease detected.
    </div>
  `;
  return;
}
resultBox.innerHTML = `
<div class="diagnosis-card">

    <div class="result-header">
        <h3>🌿 Disease Detected</h3>
        <div class="confidence-badge">
            ${(disease.probability * 100).toFixed(2)}% Confidence
        </div>
    </div>

    <div class="info-grid">

        <div class="info-card">
            <div class="info-title">Disease Name</div>
            <div class="info-value">${disease.name}</div>
        </div>

        <div class="info-card">
            <div class="info-title">Scientific Name</div>
            <div class="info-value">${disease.scientific_name}</div>
        </div>

        <div class="info-card">
            <div class="info-title">Crop</div>
            <div class="info-value">${crop?.name || "Unknown"}</div>
        </div>

        <div class="info-card">
            <div class="info-title">Plant Status</div>
            <div class="info-value">Infected</div>
        </div>

    </div>

    <div class="result-section">
        <h4>🩺 Recommended Treatment</h4>

        <div class="treatment-list">
            <div class="treatment-card">Remove infected leaves immediately.</div>
            <div class="treatment-card">Apply copper-based fungicide.</div>
            <div class="treatment-card">Avoid overhead irrigation.</div>
            <div class="treatment-card">Improve air circulation.</div>
        </div>
    </div>

    <div class="result-section">
        <h4>🌱 Prevention Tips</h4>

        <div class="treatment-list">
            <div class="prevention-card">Use disease-free planting material.</div>
            <div class="prevention-card">Inspect plants weekly.</div>
            <div class="prevention-card">Maintain proper spacing.</div>
            <div class="prevention-card">Avoid excessive humidity.</div>
        </div>
    </div>

</div>
`;
  } catch (error) {
    resultBox.innerText = "❌ Error: " + error.message;
    console.error(error);
  }
});
