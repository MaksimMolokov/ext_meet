# Meeting Audio Recorder

Chrome extension for recording audio from Google Meet and Zoom Web meetings.

## Features

- Records tab audio with video track (required for audio capture on macOS)
- WebM format with Opus codec (128 kbps)
- Microphone mixing support (optional)
- Works on Google Meet and Zoom Web

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the repository directory

## Usage

1. Navigate to a Google Meet or Zoom Web meeting
2. Click the extension icon
3. Click "Enable Microphone" (first time only) - this grants permission for mic mixing
4. Click "Start Recording"
5. Chrome will show a tab picker - select the current tab and check "Share tab audio"
6. Speak or play audio in the meeting
7. Click "Stop & Download" to save the recording

## Permissions

- `activeTab` - Access current tab
- `tabCapture` - Capture tab audio/video
- `desktopCapture` - Fallback for tab capture
- `offscreen` - Run media recorder in offscreen document
- `downloads` - Save recorded files
- `storage` - Store recording state
- `tabs` - Query active tabs

## Architecture

- **background.js** - Service worker, manages Port API connection with offscreen
- **offscreen.js** - Media recorder in offscreen document, tries `chromeMediaSource: "tab"` then falls back to `"desktop"`
- **popup.js** - UI controller with microphone permission priming
- **scrapingScript.js** - Content script for Google Meet transcript extraction
- **micsetup.js/html** - Microphone permission setup page

## Based on

This extension is based on the architecture from [recallai/chrome-recording-transcription-extension](https://github.com/recallai/chrome-recording-transcription-extension).

## License

MIT
