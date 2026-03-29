# YOT Developer – Flutter App

This directory contains the Flutter mobile app for the **YOT Developer** platform.
It mirrors all features of the Next.js web app and communicates with it via REST API.

## Prerequisites

| Tool | Version |
|------|---------|
| Flutter | ≥ 3.10.0 |
| Dart | ≥ 3.0.0 |
| Android Studio / Xcode | latest stable |

## Getting started

```bash
# From this directory:
flutter pub get
flutter run
```

## Project structure

```
flutter/
├── lib/
│   ├── main.dart              # Entry point, router, AppShell
│   ├── theme/
│   │   └── app_theme.dart     # Design tokens (colors, typography, widgets)
│   ├── services/
│   │   └── api_service.dart   # REST API client (http package)
│   ├── models/
│   │   └── models.dart        # Shared data classes
│   ├── screens/
│   │   ├── home_screen.dart          # DevTools Explorer
│   │   ├── playground_screen.dart    # JS Playground
│   │   ├── challenges_screen.dart    # Challenges + XP system
│   │   ├── dashboard_screen.dart     # User stats & badges
│   │   ├── inspector_screen.dart     # DOM Inspector
│   │   ├── code_analyzer_screen.dart # Code Analyzer
│   │   └── site_tester_screen.dart   # Security header tester (uses API)
│   └── widgets/               # Reusable UI widgets (future)
├── pubspec.yaml
└── README.md
```

## API communication

The app talks to the Next.js backend via `ApiService` (`lib/services/api_service.dart`).
The base URL defaults to `https://yot-developer.vercel.app/api`.
Override it for local development:

```dart
// lib/services/api_service.dart
const String _baseUrl = 'http://localhost:3000/api';
```

Currently exposed endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/site-test` | Analyse security headers for a given URL |

## Building for production

```bash
# Android APK
flutter build apk --release

# iOS (macOS only)
flutter build ipa

# Web (if you want a Flutter web build alongside Next.js)
flutter build web
```
