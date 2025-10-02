document.addEventListener('DOMContentLoaded', function() {
    loadTelegramSettings();
    loadAlerts();

    document.getElementById('saveTelegramSettings').addEventListener('click', saveTelegramSettings);
    document.getElementById('addAlert').addEventListener('click', addAlert);

    // Add focus events to handle masked inputs
    document.getElementById('telegramBotToken').addEventListener('focus', handleSensitiveInputFocus);
    document.getElementById('telegramChatId').addEventListener('focus', handleSensitiveInputFocus);
});

async function saveTelegramSettings() {
    const botToken = document.getElementById('telegramBotToken').value.trim();
    const chatId = document.getElementById('telegramChatId').value.trim();

    if (!botToken || !chatId) {
        showStatus('Please enter both bot token and chat ID', 'error');
        return;
    }

    // Don't save if the values are masked (contain ***)
    if (botToken.includes('***') || chatId.includes('***')) {
        showStatus('Please enter new values or clear fields to update', 'error');
        return;
    }

    try {
        await chrome.storage.sync.set({
            telegramBotToken: botToken,
            telegramChatId: chatId
        });
        showStatus('Telegram settings saved successfully!', 'success');
        // Reload to show masked values
        loadTelegramSettings();
    } catch (error) {
        showStatus('Error saving Telegram settings', 'error');
    }
}

async function loadTelegramSettings() {
    try {
        const result = await chrome.storage.sync.get(['telegramBotToken', 'telegramChatId']);
        if (result.telegramBotToken) {
            document.getElementById('telegramBotToken').value = maskSensitiveData(result.telegramBotToken);
            document.getElementById('telegramBotToken').dataset.originalValue = result.telegramBotToken;
        }
        if (result.telegramChatId) {
            document.getElementById('telegramChatId').value = maskSensitiveData(result.telegramChatId);
            document.getElementById('telegramChatId').dataset.originalValue = result.telegramChatId;
        }
    } catch (error) {
        console.error('Error loading Telegram settings:', error);
    }
}

function maskSensitiveData(data) {
    if (!data || data.length < 8) return data;

    if (data.includes(':')) {
        // Bot token format: show first 3 and last 3 characters
        const parts = data.split(':');
        return parts[0].substring(0, 3) + '***:***' + parts[1].substring(parts[1].length - 3);
    } else {
        // Chat ID format: show first 3 and last 3 characters
        return data.substring(0, 3) + '***' + data.substring(data.length - 3);
    }
}

function handleSensitiveInputFocus(event) {
    const input = event.target;
    const originalValue = input.dataset.originalValue;

    if (originalValue && input.value.includes('***')) {
        input.value = '';
        input.placeholder = 'Enter new value or leave empty to keep current';
    }
}

async function addAlert() {
    const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const price = parseFloat(document.getElementById('alertPrice').value);
    const type = document.getElementById('alertType').value;

    if (!symbol || !price || price <= 0) {
        showStatus('Please enter a valid stock symbol and price', 'error');
        return;
    }

    const alert = {
        id: Date.now(),
        symbol: symbol,
        price: price,
        type: type,
        created: new Date().toISOString()
    };

    try {
        const result = await chrome.storage.local.get(['stockAlerts']);
        const alerts = result.stockAlerts || [];

        const existingAlert = alerts.find(a => a.symbol === symbol && a.type === type);
        if (existingAlert) {
            showStatus(`Alert for ${symbol} (${type}) already exists`, 'error');
            return;
        }

        alerts.push(alert);
        await chrome.storage.local.set({ stockAlerts: alerts });

        document.getElementById('stockSymbol').value = '';
        document.getElementById('alertPrice').value = '';

        loadAlerts();
        showStatus('Alert added successfully!', 'success');

        chrome.runtime.sendMessage({ action: 'startMonitoring' });
    } catch (error) {
        showStatus('Error adding alert', 'error');
    }
}

async function loadAlerts() {
    try {
        const result = await chrome.storage.local.get(['stockAlerts']);
        const alerts = result.stockAlerts || [];

        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';

        if (alerts.length === 0) {
            alertsList.innerHTML = '<p>No alerts set</p>';
            return;
        }

        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-item';
            alertDiv.innerHTML = `
                <span>${alert.symbol} - $${alert.price} (${alert.type})</span>
                <button class="delete-btn" onclick="deleteAlert(${alert.id})">Delete</button>
            `;
            alertsList.appendChild(alertDiv);
        });
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

async function deleteAlert(alertId) {
    try {
        const result = await chrome.storage.local.get(['stockAlerts']);
        const alerts = result.stockAlerts || [];

        const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
        await chrome.storage.local.set({ stockAlerts: updatedAlerts });

        loadAlerts();
        showStatus('Alert deleted successfully!', 'success');
    } catch (error) {
        showStatus('Error deleting alert', 'error');
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

window.deleteAlert = deleteAlert;