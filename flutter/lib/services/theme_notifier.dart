import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';

class ThemeNotifier extends ChangeNotifier {
  static const _prefKey = 'yot_theme';

  YotThemeId _themeId = YotThemeId.dark;

  YotThemeId get themeId => _themeId;
  ThemeData get themeData => AppTheme.themeFor(_themeId);
  YotColors get colors => YotColors.forId(_themeId);

  /// Swatch colours matching the web palette picker.
  static const swatches = {
    YotThemeId.dark:  Color(0xFF6366F1),
    YotThemeId.white: Color(0xFF4F46E5),
    YotThemeId.ocean: Color(0xFF0EA5E9),
  };

  static const names = {
    YotThemeId.dark:  'Dark',
    YotThemeId.white: 'White',
    YotThemeId.ocean: 'Ocean',
  };

  ThemeNotifier() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKey);
      if (saved != null) {
        final id = YotThemeId.values.firstWhere(
          (t) => t.name == saved,
          orElse: () => YotThemeId.dark,
        );
        if (id != _themeId) {
          _themeId = id;
          notifyListeners();
        }
      }
    } catch (_) {
      // Silently ignore SharedPreferences errors; defaults to dark.
    }
  }

  Future<void> setTheme(YotThemeId id) async {
    if (_themeId == id) return;
    _themeId = id;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, id.name);
    } catch (_) {
      // Ignore persistence errors.
    }
  }
}
