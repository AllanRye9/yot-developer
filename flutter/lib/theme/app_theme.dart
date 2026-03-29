import 'package:flutter/material.dart';

/// Centralised design tokens matching the web app.
class AppTheme {
  AppTheme._();

  // ─── Color palette ────────────────────────────────
  static const Color backgroundColor = Color(0xFF0A0A0F);
  static const Color cardColor       = Color(0xFF12121A);
  static const Color borderColor     = Color(0xFF1E1E2E);
  static const Color accentColor     = Color(0xFF6366F1);
  static const Color accentLight     = Color(0xFF8B5CF6);
  static const Color cyanAccent      = Color(0xFF06B6D4);
  static const Color textPrimary     = Color(0xFFE2E8F0);
  static const Color mutedColor      = Color(0xFF64748B);
  static const Color successColor    = Color(0xFF10B981);
  static const Color errorColor      = Color(0xFFEF4444);
  static const Color warningColor    = Color(0xFFF59E0B);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: backgroundColor,
      colorScheme: const ColorScheme.dark(
        primary: accentColor,
        secondary: accentLight,
        surface: cardColor,
        error: errorColor,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: cardColor,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardTheme(
        color: cardColor,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderColor),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardColor,
        selectedItemColor: accentColor,
        unselectedItemColor: mutedColor,
        elevation: 0,
      ),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: textPrimary),
        bodyMedium: TextStyle(color: textPrimary),
        bodySmall: TextStyle(color: mutedColor),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accentColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: accentColor),
        ),
        hintStyle: const TextStyle(color: mutedColor),
        labelStyle: const TextStyle(color: mutedColor),
      ),
    );
  }
}
