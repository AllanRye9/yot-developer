import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Home / DevTools Explorer screen.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _categories = [
    {'icon': Icons.terminal,     'name': 'Console',     'desc': 'Logging, debugging and output inspection'},
    {'icon': Icons.network_check,'name': 'Network',     'desc': 'XHR, Fetch, WebSockets and performance'},
    {'icon': Icons.speed,        'name': 'Performance', 'desc': 'Profiling and runtime measurements'},
    {'icon': Icons.layers,       'name': 'Elements',    'desc': 'DOM structure and CSS styles'},
    {'icon': Icons.storage,      'name': 'Storage',     'desc': 'Cookies, localStorage and IndexedDB'},
    {'icon': Icons.bug_report,   'name': 'Debugger',    'desc': 'Breakpoints and call-stack inspection'},
    {'icon': Icons.memory,       'name': 'Memory',      'desc': 'Heap snapshots and allocation tracking'},
    {'icon': Icons.security,     'name': 'Security',    'desc': 'HTTPS, CSP and certificate details'},
  ];

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;
    return Scaffold(
      backgroundColor: c.backgroundColor,
      body: CustomScrollView(
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DevTools Explorer',
                    style: TextStyle(
                      color: c.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Explore browser DevTools concepts with interactive examples',
                    style: TextStyle(color: c.mutedColor, fontSize: 14),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.3,
              ),
              itemCount: _categories.length,
              itemBuilder: (context, i) {
                final cat = _categories[i];
                return _CategoryCard(
                  icon: cat['icon'] as IconData,
                  name: cat['name'] as String,
                  desc: cat['desc'] as String,
                );
              },
            ),
          ),
          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({
    required this.icon,
    required this.name,
    required this.desc,
  });

  final IconData icon;
  final String name;
  final String desc;

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;
    return Card(
      color: c.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: c.borderColor),
      ),
      elevation: 0,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: c.accentColor.withAlpha(26),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: c.accentColor.withAlpha(77)),
                ),
                child: Icon(icon, size: 18, color: c.accentColor),
              ),
              const SizedBox(height: 10),
              Text(
                name,
                style: TextStyle(
                  color: c.textPrimary,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                desc,
                style: TextStyle(color: c.mutedColor, fontSize: 11),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
