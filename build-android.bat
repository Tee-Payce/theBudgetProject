@echo off
echo Building Android APK for Production...
echo.

REM Check if EAS CLI is installed
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo EAS CLI not found. Installing...
    npm install -g eas-cli
)

REM Login to Expo (if not already logged in)
echo Checking Expo authentication...
eas whoami
if %errorlevel% neq 0 (
    echo Please login to your Expo account:
    eas login
)

REM Build the APK
echo.
echo Starting production APK build...
eas build --platform android --profile production

echo.
echo Build completed! Check your Expo dashboard for the download link.
echo Visit: https://expo.dev/
pause