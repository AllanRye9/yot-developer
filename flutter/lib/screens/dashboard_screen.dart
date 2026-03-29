import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Dashboard screen showing XP, badges and category progress.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppTheme.accentColor, AppTheme.accentLight],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.accentColor.withAlpha(77),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text('1', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Level 1 Developer',
                          style: TextStyle(color: AppTheme.textPrimary, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Row(children: [
                        const Icon(Icons.bolt, size: 14, color: AppTheme.warningColor),
                        const Text('0 XP total', style: TextStyle(color: AppTheme.mutedColor, fontSize: 13)),
                        const SizedBox(width: 12),
                        const Icon(Icons.check_circle_outline, size: 14, color: AppTheme.successColor),
                        const Text('0 done', style: TextStyle(color: AppTheme.mutedColor, fontSize: 13)),
                      ]),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: 0,
                          backgroundColor: AppTheme.borderColor,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text('500 XP until next level',
                          style: TextStyle(color: AppTheme.mutedColor, fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Category progress
          _SectionHeader(title: 'Category Progress', icon: Icons.bar_chart),
          const SizedBox(height: 12),
          ...['Console', 'Network', 'Performance', 'Elements', 'Storage', 'Security'].map(
            (cat) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: _ProgressRow(label: cat, progress: 0, total: 3),
            ),
          ),

          const SizedBox(height: 8),

          // Badges
          _SectionHeader(title: 'Badges', icon: Icons.emoji_events),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: const [
              _BadgeChip(icon: '🚀', name: 'First Steps', earned: false),
              _BadgeChip(icon: '🔥', name: 'On Fire', earned: false),
              _BadgeChip(icon: '💎', name: 'Diamond', earned: false),
              _BadgeChip(icon: '🏆', name: 'Champion', earned: false),
              _BadgeChip(icon: '⚡', name: 'Speed Run', earned: false),
            ],
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, required this.icon});
  final String title;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Icon(icon, size: 16, color: AppTheme.accentColor),
      const SizedBox(width: 8),
      Text(title, style: const TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
    ]);
  }
}

class _ProgressRow extends StatelessWidget {
  const _ProgressRow({required this.label, required this.progress, required this.total});
  final String label;
  final int progress;
  final int total;

  @override
  Widget build(BuildContext context) {
    final pct = total > 0 ? progress / total : 0.0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(label, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
          Text('$progress/$total', style: const TextStyle(color: AppTheme.mutedColor, fontSize: 12)),
        ]),
        const SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: pct,
            backgroundColor: AppTheme.borderColor,
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}

class _BadgeChip extends StatelessWidget {
  const _BadgeChip({required this.icon, required this.name, required this.earned});
  final String icon;
  final String name;
  final bool earned;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: earned ? AppTheme.accentColor.withAlpha(26) : AppTheme.cardColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: earned ? AppTheme.accentColor.withAlpha(102) : AppTheme.borderColor),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Text(icon, style: TextStyle(fontSize: 16, color: earned ? null : const Color(0x88888888))),
        const SizedBox(width: 6),
        Text(name, style: TextStyle(
          color: earned ? AppTheme.textPrimary : AppTheme.mutedColor,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        )),
      ]),
    );
  }
}
