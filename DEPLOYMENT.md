# Android APK Build & Deployment Guide

## Prerequisites
1. **Expo Account**: Create account at https://expo.dev
2. **EAS CLI**: Install globally with `npm install -g @expo/eas-cli`

## Quick Build (Automated)
Run the batch script:
```bash
./build-android.bat
```

## Manual Build Steps

### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Build APK for Production
```bash
eas build --platform android --profile production
```

### 4. Build AAB for Google Play Store (Optional)
```bash
eas build --platform android --profile production-aab
```

## Build Profiles Available
- **production**: Builds APK file for direct installation
- **production-aab**: Builds AAB file for Google Play Store
- **preview**: Internal testing builds
- **development**: Development builds with dev client

## Download & Install
1. After build completes, visit your Expo dashboard
2. Download the APK file
3. Install on Android device (enable "Install from unknown sources")

## Distribution Options

### Direct APK Distribution
- Share APK file directly with users
- Users must enable "Install from unknown sources"
- No app store approval needed

### Google Play Store
1. Use `production-aab` profile to build AAB
2. Upload to Google Play Console
3. Follow Google Play review process

### Internal Testing
- Use Expo's internal distribution
- Share via QR code or link
- No need for app store

## App Configuration
- **Package Name**: com.teepayce.hukuproj
- **App Name**: The Project Huku
- **Version**: 1.0.0
- **Permissions**: Storage access for database

## Troubleshooting
- Ensure all dependencies are installed: `npm install`
- Check Expo project ID in app.json
- Verify Android configuration in app.json
- Check build logs in Expo dashboard for errors

## Production Checklist
- [ ] Update version number in app.json
- [ ] Test all features thoroughly
- [ ] Verify database functionality
- [ ] Check app icons and splash screen
- [ ] Test on different Android devices
- [ ] Build and test APK before distribution