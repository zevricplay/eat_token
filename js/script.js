// Token Generator JavaScript Functionality

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const tokenInput = document.getElementById('tokenInput');
const pasteBtn = document.querySelector('.paste-btn');
const conversionAction = document.getElementById('conversionAction');
const providerButtons = document.querySelectorAll('.provider-btn');
const navItems = document.querySelectorAll('.nav-item');
const contactBtn = document.querySelector('.contact-btn');
const quickButtons = document.querySelectorAll('.quick-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', handleGenerateToken);
    pasteBtn.addEventListener('click', handlePaste);
    contactBtn.addEventListener('click', handleContact);
    
    providerButtons.forEach(btn => {
        btn.addEventListener('click', handleProviderLogin);
    });

    navItems.forEach((item, index) => {
        item.addEventListener('click', () => handleNavigation(index));
    });

    quickButtons.forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });

    // Auto-save to localStorage
    tokenInput.addEventListener('change', saveToLocalStorage);
}

// Handle Generate Token
function handleGenerateToken() {
    const token = tokenInput.value.trim();
    const action = conversionAction.value;

    if (!token) {
        showAlert('Please paste a token or URL first', 'error');
        return;
    }

    // Extract token from URL if needed
    const extractedToken = extractTokenFromUrl(token);
    
    if (!extractedToken) {
        showAlert('Invalid token or URL format', 'error');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = 'PROCESSING...';

    // Simulate token conversion (replace with actual API call)
    setTimeout(() => {
        const convertedToken = convertToken(extractedToken, action);
        showAlert(`✅ Token converted! Ready to use.`, 'success');
        
        // Copy to clipboard
        copyToClipboard(convertedToken);
        
        // Reset button
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE TOKEN →';

        // Log to history
        saveToHistory({
            token: extractedToken.substring(0, 20) + '...',
            action: action,
            timestamp: new Date().toLocaleString()
        });
    }, 2000);
}

// Extract token from URL
function extractTokenFromUrl(input) {
    // Check if it's a URL
    if (input.includes('http') || input.includes('?')) {
        const urlParams = new URLSearchParams(input.split('?')[1]);
        const eatToken = urlParams.get('eat');
        if (eatToken) return eatToken;
    }
    
    // Check if it's direct token (long alphanumeric string)
    if (input.length > 50 && /^[a-zA-Z0-9]{50,}$/.test(input)) {
        return input;
    }

    return null;
}

// Convert Token (Placeholder - Replace with actual conversion logic)
function convertToken(token, action) {
    // This is a simulation. In production, call your backend API
    let converted = token;

    switch(action) {
        case 'EAT → Access Token':
            converted = 'access_' + token.substring(0, 30) + '...';
            break;
        case 'EAT → JWT Token':
            converted = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                       Buffer.from(token).toString('base64').substring(0, 50) + '.';
            break;
        case 'Access Token → JWT Token':
            converted = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                       Buffer.from(token).toString('base64').substring(0, 50) + '.';
            break;
        case 'JWT Token → EAT':
            converted = token.split('.')[0].substring(0, 40);
            break;
        default:
            converted = token;
    }

    return converted;
}

// Handle Paste
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

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('✅ Token copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('❌ Failed to copy', 'error');
    });
}

// Handle Provider Login
function handleProviderLogin(e) {
    const provider = e.target.closest('.provider-btn').textContent.trim().split('\n')[1] || 
                     e.target.closest('.provider-btn').textContent.trim();
    
    console.log(`Logging in with ${provider}...`);
    
    // Simulate OAuth login flow
    showAlert(`🔐 Redirecting to ${provider} login...`, 'info');
    
    // In production, implement actual OAuth flow
    setTimeout(() => {
        showAlert(`✅ Login successful! Check your browser history for "eat=" parameter`, 'success');
    }, 1500);
}

// Handle Navigation
function handleNavigation(index) {
    navItems.forEach(item => item.classList.remove('active'));
    navItems[index].classList.add('active');

    const sections = ['HOME', 'TOKEN', 'BIO', 'UNIQUE'];
    console.log(`Navigating to: ${sections[index]}`);

    // Add navigation logic here
    switch(sections[index]) {
        case 'TOKEN':
            document.querySelector('.generator-form').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'HOME':
            document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
            break;
        default:
            showAlert(`${sections[index]} section coming soon!`, 'info');
    }
}

// Handle Quick Actions
function handleQuickAction(e) {
    const action = e.target.textContent.trim();
    console.log(`Quick action: ${action}`);
    
    document.querySelector('.generator-form').scrollIntoView({ behavior: 'smooth' });
    
    // Set conversion action based on button clicked
    if (action.includes('EAT TO JWT')) {
        conversionAction.value = 'EAT → JWT Token';
    } else if (action.includes('EAT TO ACCESS')) {
        conversionAction.value = 'EAT → Access Token';
    }
}

// Handle Contact
function handleContact() {
    const email = 'support@fftools.site';
    const subject = 'Free Fire Token Generator - Support';
    const body = 'Hello, I need help with...';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Alert System
function showAlert(message, type = 'info') {
    // Create alert element
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

    // Auto remove
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// LocalStorage Functions
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

// Load on page load
window.addEventListener('load', loadFromLocalStorage);

// History Management
function saveToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('tokenHistory') || '[]');
    
    // Keep only last 10 entries
    if (history.length >= 10) {
        history.shift();
    }
    
    history.push(entry);
    localStorage.setItem('tokenHistory', JSON.stringify(history));
    console.log('History saved:', history);
}

// Utility Functions
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Video Tutorial Click Handler
document.addEventListener('DOMContentLoaded', () => {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            showAlert('📺 Video tutorial feature coming soon!', 'info');
            // In production, open YouTube modal or redirect to video
        });
    }
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate token
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleGenerateToken();
    }
    
    // Ctrl/Cmd + V to paste (already handled by browser, but we can add custom handling)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (document.activeElement === tokenInput) {
            handlePaste();
        }
    }
});

// Performance optimization - Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Console Easter Egg
console.log('%c🔥 Free Fire Token Generator 🔥', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cDeveloped with ❤️', 'color: #c084fc; font-size: 14px;');
console.log('%cHave questions? Contact us!', 'color: #3b82f6; font-size: 12px;');
