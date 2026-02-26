# Meeting Audio Recorder MVP (Chrome Extension)

This MVP records **tab audio** for:
- Google Meet (`meet.google.com`)
- Zoom Web (`*.zoom.us`)

It saves two files to Downloads:
- `meeting-recordings/<name>.webm` (audio)
- `meeting-recordings/<name>.json` (meeting metadata)

## Install
1. Open Chrome: `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select folder: `.../ext_transcribition/extension`.

## Use
1. Open a Google Meet or Zoom Web meeting tab.
2. Click extension icon -> `Start`.
3. In the picker select the meeting tab and enable **Share tab audio**.
4. Allow capture permissions if Chrome asks.
5. Click `Stop` when meeting ends.
6. Start again for the next meeting (repeatable start/stop cycle).

## Notes
- Captures participants you can hear in the tab audio mix.
- Does not capture Zoom desktop app audio (web tab only).
- Participant name extraction is best-effort and may vary by UI changes.
- Verify legal consent requirements in your jurisdiction/company policy.

## Troubleshooting
- File appears only after `Stop`.
- If popup says recording is in progress but nothing saves, click `Reset` and start again.
- Keep the meeting tab open while recording.
- Check Chrome downloads page: `chrome://downloads/`.
- If meeting tab is closed or navigated away from Meet/Zoom, recording auto-stops.
