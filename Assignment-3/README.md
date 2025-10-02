# Stock Price Alerts Chrome Extension

A Chrome extension that monitors stock prices and sends Telegram notifications when your target prices are reached.

## Features

- 📈 Track multiple stock symbols
- 🎯 Set price alerts (above/below targets)
- 📱 Get Telegram notifications instantly
- 🔄 Automatic price checking every 5 minutes
- 💾 Persistent storage of alerts

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name and username for your bot
4. Copy the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Chat ID

1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your **Chat ID** in the response (the number in `"chat":{"id":YOUR_CHAT_ID}`)

### 3. Get Stock API Access (Optional)

For better reliability, get a free API key from [Polygon.io](https://polygon.io/):

1. Sign up for a free account
2. Get your API key
3. Replace `YOUR_POLYGON_API_KEY` in `background.js` with your actual key

**Note:** The extension works without Polygon API using Yahoo Finance as fallback.

### 4. Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the extension folder
5. The extension icon should appear in your toolbar

## Usage

1. **Configure Telegram:**
   - Click the extension icon
   - Enter your Bot Token and Chat ID
   - Click "Save Telegram Settings"

2. **Add Stock Alerts:**
   - Enter a stock symbol (e.g., AAPL, TSLA, GOOGL)
   - Set your target price
   - Choose alert type (above/below)
   - Click "Add Alert"

3. **Monitor Alerts:**
   - The extension checks prices every 5 minutes
   - You'll receive Telegram messages when targets are reached
   - Triggered alerts are automatically removed

## File Structure

```
├── manifest.json          # Extension configuration
├── popup.html             # Main UI interface
├── popup.js              # UI logic and storage
├── background.js         # Background monitoring service
├── icons/                # Extension icons (add your own)
└── README.md             # This file
```

## API Details

- **Primary:** Polygon.io for real-time data
- **Fallback:** Yahoo Finance for free access
- **Notifications:** Telegram Bot API

## Troubleshooting

**No notifications received:**
- Verify Bot Token and Chat ID are correct
- Check that you've messaged the bot first
- Ensure internet connection is stable

**Price data issues:**
- Check stock symbol is valid (use official ticker symbols)
- Verify API key if using Polygon.io
- Check browser console for error messages

**Extension not working:**
- Reload the extension in `chrome://extensions/`
- Check that all files are in the same folder
- Verify permissions are granted

## Security Notes

- Bot tokens are stored securely in Chrome's sync storage
- No sensitive data is transmitted to third parties
- All API calls use HTTPS

## Development

To modify the extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh button on your extension
4. Test your changes

---

**Note:** This extension is for educational purposes. Always verify stock prices through official sources before making investment decisions.