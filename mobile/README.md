# 🎁 100 Days of Free AI — Mobile App (Expo & React Native)

Official mobile application for the **100 Days of Free AI** series by `@harshith.claude`.

---

## ⚡ Why Daily Updates Work Automatically (Zero App Store Submissions)

This mobile app solves the problem of daily updates using a **two-tier real-time architecture**:

### 1. Dynamic Episode Sync (Supabase Database & Storage)
- The app does not hardcode episodes. It connects directly to your live Supabase database (`https://tqtfkuhtvkevqhhmnkfv.supabase.co`).
- **The moment you release Day 04, 05, etc. in your dashboard or database, it appears instantly on every user's phone.**
- Includes fallback offline seed data so users can watch Days 01, 02, and 03 even without internet access.

### 2. EAS OTA (Over-The-Air) Silent Code Updates
- Powered by `expo-updates`.
- If you fix a UI component, add a new tab, or adjust colors, you simply publish an update with:
  ```bash
  eas update --branch production --message "Add new feature"
  ```
- All installed devices download the new JavaScript bundle in the background without requiring re-approval or re-submission to Apple App Store or Google Play!

---

## 📱 App Highlights & Features

- **🎬 9:16 Vertical Video Reels Feed**: TikTok & Instagram Reels style vertical swipe player with tap-to-pause, audio mute/unmute, and high-speed streaming.
- **⚡ 1-Tap Copy Station**:
  - 1-tap copy Instagram Caption + Hashtags (with haptic feedback).
  - 1-tap copy Pinned Comment (with haptic feedback).
- **📚 Complete Episode Library**: Search and filter by AI category (Coding, Voice, Art).
- **🗺️ 100-Day Roadmap**: Phase-by-phase interactive curriculum tracking total money saved.
- **📖 Integrated Notion Browser**: Opens public Notion setup guides seamlessly inside the app.
- **🎨 Warm Cream Light Mode**: Beautiful `#FAF8F5` ivory background with `#EA580C` terracotta orange accents.

---

## 🚀 How to Run Locally (Expo Go)

1. Navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Scan the QR code using:
   - **Android**: Expo Go app from Google Play.
   - **iOS**: Default Camera app to open in Expo Go.

---

## 📦 How to Build the Standalone Android `.apk`

To generate a downloadable `.apk` file that you can install directly on any Android phone:

1. Install EAS CLI (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure EAS project:
   ```bash
   eas project:init
   ```

4. Trigger the Android APK build:
   ```bash
   eas build -p android --profile preview
   ```

Expo's cloud builders will compile the Android APK and give you a direct download link (e.g. `https://expo.dev/artifacts/eas/...apk`) to download and distribute!

---

## 🔄 Publishing Instant Over-The-Air (OTA) Updates

```bash
# Push an instant update to all users
eas update --branch preview --message "Released Day 04 UI and updates"
```
