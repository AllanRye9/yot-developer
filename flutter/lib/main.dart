import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'theme/app_theme.dart';
import 'services/api_service.dart';
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
    return MaterialApp.router(
      title: 'YOT Developer',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: _router,
    );
  }
}

/// Bottom-nav shell wrapping all main screens.
class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});
  final Widget child;

  static const _tabs = [
    _NavTab(icon: Icons.code, label: 'Explorer', path: '/'),
    _NavTab(icon: Icons.play_circle_outline, label: 'Playground', path: '/playground'),
    _NavTab(icon: Icons.emoji_events_outlined, label: 'Challenges', path: '/challenges'),
    _NavTab(icon: Icons.person_outline, label: 'Dashboard', path: '/dashboard'),
    _NavTab(icon: Icons.search, label: 'Inspector', path: '/inspector'),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final idx = _tabs.indexWhere((t) => t.path == location);
    return idx < 0 ? 0 : idx;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppTheme.cardColor,
        selectedItemColor: AppTheme.accentColor,
        unselectedItemColor: AppTheme.mutedColor,
        currentIndex: _currentIndex(context),
        onTap: (i) => context.go(_tabs[i].path),
        items: _tabs
            .map((t) => BottomNavigationBarItem(icon: Icon(t.icon), label: t.label))
            .toList(),
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
