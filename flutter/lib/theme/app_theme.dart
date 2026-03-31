import 'package:flutter/material.dart';

// ─── Theme identifiers ────────────────────────────────
enum YotThemeId { dark, white, ocean }

// ─── Custom color palette (ThemeExtension) ───────────
@immutable
class YotColors extends ThemeExtension<YotColors> {
  const YotColors({
    required this.backgroundColor,
    required this.cardColor,
    required this.borderColor,
    required this.accentColor,
    required this.accentLight,
    required this.textPrimary,
    required this.mutedColor,
    required this.cyanAccent,
    required this.successColor,
    required this.errorColor,
    required this.warningColor,
  });

  final Color backgroundColor;
  final Color cardColor;
  final Color borderColor;
  final Color accentColor;
  final Color accentLight;
  final Color textPrimary;
  final Color mutedColor;
  final Color cyanAccent;
  final Color successColor;
  final Color errorColor;
  final Color warningColor;

  // ─── Predefined palettes ─────────────────────────────
  static const YotColors dark = YotColors(
    backgroundColor: Color(0xFF0A0A0F),
    cardColor:        Color(0xFF12121A),
    borderColor:      Color(0xFF1E1E2E),
    accentColor:      Color(0xFF6366F1),
    accentLight:      Color(0xFF8B5CF6),
    textPrimary:      Color(0xFFE2E8F0),
    mutedColor:       Color(0xFF64748B),
    cyanAccent:       Color(0xFF06B6D4),
    successColor:     Color(0xFF10B981),
    errorColor:       Color(0xFFEF4444),
    warningColor:     Color(0xFFF59E0B),
  );

  static const YotColors white = YotColors(
    backgroundColor: Color(0xFFF8FAFC),
    cardColor:        Color(0xFFFFFFFF),
    borderColor:      Color(0xFFE2E8F0),
    accentColor:      Color(0xFF4F46E5),
    accentLight:      Color(0xFF7C3AED),
    textPrimary:      Color(0xFF0F172A),
    mutedColor:       Color(0xFF64748B),
    cyanAccent:       Color(0xFF0EA5E9),
    successColor:     Color(0xFF10B981),
    errorColor:       Color(0xFFEF4444),
    warningColor:     Color(0xFFF59E0B),
  );

  static const YotColors ocean = YotColors(
    backgroundColor: Color(0xFF040D1A),
    cardColor:        Color(0xFF071424),
    borderColor:      Color(0xFF0E2040),
    accentColor:      Color(0xFF0EA5E9),
    accentLight:      Color(0xFF38BDF8),
    textPrimary:      Color(0xFFE0F2FE),
    mutedColor:       Color(0xFF7AB8D9),
    cyanAccent:       Color(0xFF38BDF8),
    successColor:     Color(0xFF10B981),
    errorColor:       Color(0xFFEF4444),
    warningColor:     Color(0xFFF59E0B),
  );

  static YotColors forId(YotThemeId id) {
    switch (id) {
      case YotThemeId.white: return white;
      case YotThemeId.ocean: return ocean;
      case YotThemeId.dark:  return dark;
    }
    // Exhaustive – Dart will warn if a new enum value is added without a case.
    return dark;
  }

  @override
  YotColors copyWith({
    Color? backgroundColor,
    Color? cardColor,
    Color? borderColor,
    Color? accentColor,
    Color? accentLight,
    Color? textPrimary,
    Color? mutedColor,
    Color? cyanAccent,
    Color? successColor,
    Color? errorColor,
    Color? warningColor,
  }) {
    return YotColors(
      backgroundColor: backgroundColor ?? this.backgroundColor,
      cardColor:       cardColor       ?? this.cardColor,
      borderColor:     borderColor     ?? this.borderColor,
      accentColor:     accentColor     ?? this.accentColor,
      accentLight:     accentLight     ?? this.accentLight,
      textPrimary:     textPrimary     ?? this.textPrimary,
      mutedColor:      mutedColor      ?? this.mutedColor,
      cyanAccent:      cyanAccent      ?? this.cyanAccent,
      successColor:    successColor    ?? this.successColor,
      errorColor:      errorColor      ?? this.errorColor,
      warningColor:    warningColor    ?? this.warningColor,
    );
  }

  @override
  YotColors lerp(YotColors? other, double t) {
    if (other == null) return this;
    return YotColors(
      backgroundColor: Color.lerp(backgroundColor, other.backgroundColor, t)!,
      cardColor:       Color.lerp(cardColor,       other.cardColor,       t)!,
      borderColor:     Color.lerp(borderColor,     other.borderColor,     t)!,
      accentColor:     Color.lerp(accentColor,     other.accentColor,     t)!,
      accentLight:     Color.lerp(accentLight,     other.accentLight,     t)!,
      textPrimary:     Color.lerp(textPrimary,     other.textPrimary,     t)!,
      mutedColor:      Color.lerp(mutedColor,      other.mutedColor,      t)!,
      cyanAccent:      Color.lerp(cyanAccent,      other.cyanAccent,      t)!,
      successColor:    Color.lerp(successColor,    other.successColor,    t)!,
      errorColor:      Color.lerp(errorColor,      other.errorColor,      t)!,
      warningColor:    Color.lerp(warningColor,    other.warningColor,    t)!,
    );
  }
}

// ─── BuildContext convenience extension ───────────────
extension YotThemeContext on BuildContext {
  YotColors get yotColors =>
      Theme.of(this).extension<YotColors>() ?? YotColors.dark;
}

/// Centralised design tokens matching the web app.
class AppTheme {
  AppTheme._();

  // Legacy static constants kept for backward-compat (dark palette)
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

  static ThemeData _buildTheme(YotColors c, Brightness brightness) {
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: c.backgroundColor,
      extensions: [c],
      colorScheme: ColorScheme(
        brightness: brightness,
        primary:   c.accentColor,
        onPrimary: Colors.white,
        secondary: c.accentLight,
        onSecondary: Colors.white,
        surface:   c.cardColor,
        onSurface: c.textPrimary,
        error:     c.errorColor,
        onError:   Colors.white,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: c.cardColor,
        foregroundColor: c.textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: c.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardTheme(
        color: c.cardColor,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: c.borderColor),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: c.cardColor,
        selectedItemColor: c.accentColor,
        unselectedItemColor: c.mutedColor,
        elevation: 0,
      ),
      textTheme: TextTheme(
        bodyLarge:  TextStyle(color: c.textPrimary),
        bodyMedium: TextStyle(color: c.textPrimary),
        bodySmall:  TextStyle(color: c.mutedColor),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: c.accentColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: c.cardColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: c.borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: c.borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: c.accentColor),
        ),
        hintStyle: TextStyle(color: c.mutedColor),
        labelStyle: TextStyle(color: c.mutedColor),
      ),
    );
  }

  static ThemeData get darkTheme  => _buildTheme(YotColors.dark,  Brightness.dark);
  static ThemeData get whiteTheme => _buildTheme(YotColors.white, Brightness.light);
  static ThemeData get oceanTheme => _buildTheme(YotColors.ocean, Brightness.dark);

  static ThemeData themeFor(YotThemeId id) {
    switch (id) {
      case YotThemeId.white: return whiteTheme;
      case YotThemeId.ocean: return oceanTheme;
      case YotThemeId.dark:  return darkTheme;
    }
    // Exhaustive – Dart will warn if a new enum value is added without a case.
    return darkTheme;
  }
}
