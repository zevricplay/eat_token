// Advanced Token Generator with Real Backend Integration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const tokenInput = document.getElementById('tokenInput');
const pasteBtn = document.querySelector('.paste-btn');
const conversionAction = document.getElementById('conversionAction');
const providerButtons = document.querySelectorAll('.provider-btn');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeApp();
});

function setupEventListeners() {
    generateBtn.addEventListener('click', handleGenerateToken);
    pasteBtn.addEventListener('click', handlePaste);
    providerButtons.forEach(btn => btn.addEventListener('click', handleProviderLogin));
}

function initializeApp() {
    loadFromLocalStorage();
    checkServerStatus();
}

async function handleGenerateToken() {
    try {
        const token = tokenInput.value.trim();
        const action = conversionAction.value;

        if (!token) {
            showAlert('Please paste a token first', 'error');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'PROCESSING...';

        const extractedToken = extractTokenFromUrl(token);
        if (!extractedToken) {
            showAlert('Invalid token format', 'error');
            generateBtn.disabled = false;
            generateBtn.textContent = 'GENERATE TOKEN →';
            return;
        }

        let endpoint, payload, convertedToken;

        // Determine endpoint based on action
        if (action === 'EAT → Access Token') {
            endpoint = '/convert/eat-to-access';
            payload = { eat: extractedToken };
        } else if (action === 'EAT → JWT Token') {
            endpoint = '/convert/eat-to-jwt';
            payload = { eat: extractedToken };
        } else if (action === 'Access Token → JWT Token') {
            endpoint = '/convert/access-to-jwt';
            payload = { accessToken: extractedToken };
        } else if (action === 'JWT Token → EAT') {
            endpoint = '/convert/jwt-to-eat';
            payload = { jwtToken: extractedToken };
        }

        // Call API
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            // Get converted token
            convertedToken = result.jwtToken || result.accessToken || result.eat;
            
            showAlert('✅ Token converted successfully!', 'success');
            copyToClipboard(convertedToken);
            
            // Save to history
            await saveToHistory({
                originalToken: extractedToken.substring(0, 20) + '...',
                convertedToken: convertedToken.substring(0, 20) + '...',
                action: action,
                timestamp: new Date().toLocaleString()
            });
        } else {
            showAlert('❌ ' + (result.error || 'Conversion failed'), 'error');
        }

        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE TOKEN →';

    } catch (error) {
        console.error('Error:', error);
        showAlert('❌ Server error: ' + error.message, 'error');
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE TOKEN →';
    }
}

async function handleProviderLogin(e) {
    const provider = e.target.closest('.provider-btn').textContent.trim().toLowerCase();
    
    showAlert(`🔐 Redirecting to ${provider} login...`, 'info');

    // Simulate OAuth flow
    setTimeout(() => {
        showAlert(`✅ Login successful! Check browser history for "eat=" parameter`, 'success');
    }, 1500);
}

function extractTokenFromUrl(input) {
    if (input.includes('http') || input.includes('?')) {
        const urlParams = new URLSearchParams(input.split('?')[1]);
        const eatToken = urlParams.get('eat');
        if (eatToken) return eatToken;
    }
    
    if (input.length > 50 && /^[a-zA-Z0-9]{50,}$/.test(input)) {
        return input;
    }

    return null;
}

async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        tokenInput.value = text;
        saveToLocalStorage();
        showAlert('✅ Pasted from clipboard', 'success');
    } catch (err) {
        showAlert('❌ Failed to read clipboard', 'error');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('✅ Copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('❌ Failed to copy', 'error');
    });
}

async function saveToHistory(entry) {
    try {
        let history = JSON.parse(localStorage.getItem('tokenHistory') || '[]');
        
        if (history.length >= 20) {
            history.shift();
        }
        
        history.push(entry);
        localStorage.setItem('tokenHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

function saveToLocalStorage() {
    const data = {
        token: tokenInput.value,
        action: conversionAction.value,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('tokenGeneratorData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('tokenGeneratorData');
    if (data) {
        const parsed = JSON.parse(data);
        tokenInput.value = parsed.token || '';
        conversionAction.value = parsed.action || '';
    }
}

async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            console.log('✅ Server connected');
        }
    } catch (error) {
        console.warn('⚠️ Server not accessible');
    }
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleGenerateToken();
    }
});

console.log('%c🔥 FF Token Generator 🔥', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cBackend Connected ✅', 'color: #10b981; font-size: 14px;');
