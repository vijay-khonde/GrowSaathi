/* ================================
   🌱 SMART CROP ADVISOR - SEMPROJECT.JS
   ================================ */

// Check if user is logged in
const currentUserStr = localStorage.getItem('currentUser');
if (!currentUserStr) {
    // Redirect to login if not logged in
    window.location.href = "Registration_page.html";
}

const currentUser = JSON.parse(currentUserStr);

// Display user name and welcome info
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic welcome header
    const welcomeHeader = document.querySelector('h2.text-center');
    if (welcomeHeader && currentUser) {
        welcomeHeader.innerHTML = `🌾 Welcome back, ${currentUser.fullName}!`;
    }

    // Set weather widget location
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget && currentUser) {
        const title = weatherWidget.querySelector('h5');
        if (title) {
            title.innerHTML = `<i class="bi bi-cloud-sun me-2"></i>Weather at ${currentUser.farmLocation}`;
        }
        
        // Generate simulated dynamic weather based on location
        const temps = [24, 27, 29, 31, 33, 26, 28];
        const conds = ['Sunny', 'Partly Cloudy', 'Clear Skies', 'Light Rain', 'Humid'];
        const randomTemp = temps[Math.floor(Math.random() * temps.length)];
        const randomCond = conds[Math.floor(Math.random() * conds.length)];
        
        const tempEl = document.getElementById('currentTemp');
        const condEl = document.getElementById('weatherCondition');
        if (tempEl) tempEl.textContent = `${randomTemp}°C`;
        if (condEl) condEl.textContent = randomCond;
    }

    // Load user query history
    loadUserHistory();
});

/* ================================
   Notifications Utility
   ================================ */
function showNotification(msg, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    if (notification && notificationText) {
        notificationText.textContent = msg;
        notification.style.background = isError ? '#d32f2f' : '#ffb300';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    } else {
        alert(msg);
    }
}

/* ================================
   Load Search History from MongoDB
   ================================ */
async function loadUserHistory() {
    const historyContainer = document.getElementById('historyLogs');
    if (!historyContainer) return;

    try {
        const res = await fetch(`/api/history/${currentUser.id}`);
        if (!res.ok) {
            throw new Error('Failed to fetch history');
        }
        const data = await res.json();
        
        if (data.length === 0) {
            historyContainer.innerHTML = `<p class="text-muted text-center py-3">No recent logs found. Start asking our AI!</p>`;
            return;
        }

        historyContainer.innerHTML = '';
        data.forEach(item => {
            const date = new Date(item.createdAt).toLocaleString();
            let details = '';
            
            if (item.queryType === 'recommendation') {
                details = `Crop: <strong>${item.inputDetails.crop}</strong>, Soil: <strong>${item.inputDetails.soil}</strong>, Season: <strong>${item.inputDetails.season}</strong>`;
            } else if (item.queryType === 'disease') {
                details = `Scan: <strong>${item.inputDetails.imageName || 'Plant Image'}</strong>`;
            }

            const itemDiv = document.createElement('div');
            itemDiv.className = 'history-item p-3 mb-2 border-bottom';
            itemDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge ${item.queryType === 'recommendation' ? 'bg-success' : 'bg-warning'} text-white">
                        ${item.queryType === 'recommendation' ? 'Crop Recommendation' : 'Disease Prediction'}
                    </span>
                    <small class="text-muted">${date}</small>
                </div>
                <div class="small text-secondary mb-2">${details}</div>
                <button class="btn btn-sm btn-outline-success py-0 px-2 toggle-history-btn">View Result</button>
                <div class="history-response mt-2 p-2 bg-light rounded text-dark d-none" style="white-space: pre-wrap; font-size: 0.9rem;">
                    ${item.responseText}
                </div>
            `;
            
            // Toggle view button logic
            const toggleBtn = itemDiv.querySelector('.toggle-history-btn');
            const responseDiv = itemDiv.querySelector('.history-response');
            toggleBtn.addEventListener('click', () => {
                if (responseDiv.classList.contains('d-none')) {
                    responseDiv.classList.remove('d-none');
                    toggleBtn.textContent = 'Hide Result';
                } else {
                    responseDiv.classList.add('d-none');
                    toggleBtn.textContent = 'View Result';
                }
            });

            historyContainer.appendChild(itemDiv);
        });
    } catch (err) {
        console.error('Error fetching history:', err);
        historyContainer.innerHTML = `<p class="text-danger text-center py-2">Error loading history logs.</p>`;
    }
}

/* ================================
   Crop Recommendations Form Submit
   ================================ */
const recForm = document.getElementById('recommendationForm');
if (recForm) {
    recForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const crop = document.getElementById("cropType").value;
        const soil = document.getElementById("soilType").value;
        const season = document.getElementById("season").value;

        const resultBox = document.getElementById("recommendationResult");
        resultBox.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-success" role="status"></div>
                <p class="mt-2 text-success fw-bold">⏳ Connecting with agricultural advisor...</p>
            </div>
        `;

        try {
            const res = await fetch('/api/farming/recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop, soil, season, userId: currentUser.id })
            });

            const data = await res.json();

            if (!res.ok) {
    resultBox.textContent = `❌ Error: ${data.error || 'Failed to generate recommendation.'}`;
    return;
}

// Format AI response nicely
let formattedText = data.recommendation
    .replace(/^### (.*$)/gim, '<h3 class="text-success mt-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h4 class="text-success mt-3">$1</h4>')
    .replace(/^# (.*$)/gim, '<h5 class="text-success mt-3">$1</h5>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

resultBox.innerHTML = `
    <div class="recommendation-content">
        ${formattedText}
    </div>
`;
            showNotification('AI recommendations loaded and logged! ✅');
            
            // Reload history panel
            loadUserHistory();
        } catch (err) {
            resultBox.textContent = "❌ Server error occurred while connecting to Gemini.";
            console.error(err);
        }
    });
}
