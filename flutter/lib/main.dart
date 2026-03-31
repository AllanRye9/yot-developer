import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'theme/app_theme.dart';
import 'services/api_service.dart';
import 'services/theme_notifier.dart';
import 'screens/home_screen.dart';
import 'screens/playground_screen.dart';
import 'screens/challenges_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/inspector_screen.dart';
import 'screens/code_analyzer_screen.dart';
import 'screens/site_tester_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider<ApiService>(create: (_) => ApiService()),
        ChangeNotifierProvider<ThemeNotifier>(create: (_) => ThemeNotifier()),
      ],
      child: const YotDeveloperApp(),
    ),
  );
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/playground', builder: (_, __) => const PlaygroundScreen()),
        GoRoute(path: '/challenges', builder: (_, __) => const ChallengesScreen()),
        GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
        GoRoute(path: '/inspector', builder: (_, __) => const InspectorScreen()),
        GoRoute(path: '/code-analyzer', builder: (_, __) => const CodeAnalyzerScreen()),
        GoRoute(path: '/site-tester', builder: (_, __) => const SiteTesterScreen()),
      ],
    ),
  ],
);

class YotDeveloperApp extends StatelessWidget {
  const YotDeveloperApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeData = context.watch<ThemeNotifier>().themeData;
    return MaterialApp.router(
      title: 'YOT Developer',
      debugShowCheckedModeBanner: false,
      theme: themeData,
      routerConfig: _router,
    );
  }
}

/// AppShell: top AppBar with logo + theme picker, bottom tab navigation.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});
  final Widget child;

  static const _tabs = [
    _NavTab(icon: Icons.code,                  label: 'Explorer',   path: '/'),
    _NavTab(icon: Icons.play_circle_outline,   label: 'Playground', path: '/playground'),
    _NavTab(icon: Icons.emoji_events_outlined, label: 'Challenges', path: '/challenges'),
    _NavTab(icon: Icons.person_outline,        label: 'Dashboard',  path: '/dashboard'),
    _NavTab(icon: Icons.search,                label: 'Inspector',  path: '/inspector'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final idx = _tabs.indexWhere((t) => t.path == location);
    return idx < 0 ? 0 : idx;
  }

  @override
  Widget build(BuildContext context) {
    final notifier = context.watch<ThemeNotifier>();
    final c = notifier.colors;

    return Scaffold(
      appBar: _YotAppBar(notifier: notifier, colors: c),
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: c.cardColor,
        selectedItemColor: c.accentColor,
        unselectedItemColor: c.mutedColor,
        currentIndex: _currentIndex(context),
        onTap: (i) => context.go(_tabs[i].path),
        items: _tabs
            .map((t) => BottomNavigationBarItem(icon: Icon(t.icon), label: t.label))
            .toList(),
      ),
    );
  }
}

/// Top AppBar with YOT logo and palette theme picker.
class _YotAppBar extends StatelessWidget implements PreferredSizeWidget {
  const _YotAppBar({required this.notifier, required this.colors});
  final ThemeNotifier notifier;
  final YotColors colors;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: colors.cardColor,
      elevation: 0,
      titleSpacing: 16,
      title: Row(
        children: [
          // Logo icon
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [colors.accentColor, colors.accentLight],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: colors.accentColor.withAlpha(100),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(Icons.memory, size: 15, color: Colors.white),
          ),
          const SizedBox(width: 8),
          RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              children: [
                TextSpan(text: 'YOT', style: TextStyle(color: colors.accentColor)),
                TextSpan(text: ' Developer', style: TextStyle(color: colors.textPrimary)),
              ],
            ),
          ),
        ],
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(height: 1, color: colors.borderColor),
      ),
      actions: [
        // Theme picker button
        _ThemePickerButton(notifier: notifier, colors: colors),
        const SizedBox(width: 8),
      ],
    );
  }
}

/// Compact theme-picker button that opens a bottom sheet with 3 theme options.
class _ThemePickerButton extends StatelessWidget {
  const _ThemePickerButton({required this.notifier, required this.colors});
  final ThemeNotifier notifier;
  final YotColors colors;

  void _showPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: colors.cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _ThemePickerSheet(notifier: notifier),
    );
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.palette_outlined, color: colors.mutedColor, size: 20),
      tooltip: 'Change theme',
      onPressed: () => _showPicker(context),
    );
  }
}

/// Bottom sheet listing the three available themes.
class _ThemePickerSheet extends StatelessWidget {
  const _ThemePickerSheet({required this.notifier});
  final ThemeNotifier notifier;

  @override
  Widget build(BuildContext context) {
    final c = notifier.colors;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40, height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: c.borderColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Row(children: [
            Icon(Icons.palette_outlined, size: 16, color: c.accentColor),
            const SizedBox(width: 8),
            Text(
              'Color Theme',
              style: TextStyle(
                color: c.textPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ]),
          const SizedBox(height: 16),
          ...YotThemeId.values.map((id) {
            final isActive = notifier.themeId == id;
            final swatch = ThemeNotifier.swatches[id]!;
            final name = ThemeNotifier.names[id]!;
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () {
                  notifier.setTheme(id);
                  Navigator.of(context).pop();
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: isActive ? swatch.withAlpha(30) : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive ? swatch.withAlpha(120) : c.borderColor,
                    ),
                  ),
                  child: Row(children: [
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: swatch,
                        shape: BoxShape.circle,
                        boxShadow: isActive
                            ? [BoxShadow(color: swatch.withAlpha(120), blurRadius: 6)]
                            : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      name,
                      style: TextStyle(
                        color: isActive ? c.textPrimary : c.mutedColor,
                        fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                        fontSize: 14,
                      ),
                    ),
                    if (isActive) ...[
                      const Spacer(),
                      Icon(Icons.check, size: 16, color: swatch),
                    ],
                  ]),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _NavTab {
  const _NavTab({required this.icon, required this.label, required this.path});
  final IconData icon;
  final String label;
  final String path;
}

