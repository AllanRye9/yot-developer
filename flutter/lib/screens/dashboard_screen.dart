import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Dashboard screen showing XP, badges and category progress.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;
    return Scaffold(
      backgroundColor: c.backgroundColor,
      appBar: AppBar(
        backgroundColor: c.cardColor,
        title: Text('Dashboard', style: TextStyle(color: c.textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: c.cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: c.borderColor),
            ),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [c.accentColor, c.accentLight],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: c.accentColor.withAlpha(77),
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
                      Text('Level 1 Developer',
                          style: TextStyle(color: c.textPrimary, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Row(children: [
                        Icon(Icons.bolt, size: 14, color: c.warningColor),
                        Text('0 XP total', style: TextStyle(color: c.mutedColor, fontSize: 13)),
                        const SizedBox(width: 12),
                        Icon(Icons.check_circle_outline, size: 14, color: c.successColor),
                        Text('0 done', style: TextStyle(color: c.mutedColor, fontSize: 13)),
                      ]),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: 0,
                          backgroundColor: c.borderColor,
                          valueColor: AlwaysStoppedAnimation<Color>(c.accentColor),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text('500 XP until next level',
                          style: TextStyle(color: c.mutedColor, fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Category progress
          _SectionHeader(title: 'Category Progress', icon: Icons.bar_chart, colors: c),
          const SizedBox(height: 12),
          ...['Console', 'Network', 'Performance', 'Elements', 'Storage', 'Security'].map(
            (cat) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: _ProgressRow(label: cat, progress: 0, total: 3, colors: c),
            ),
          ),

          const SizedBox(height: 8),

          // Badges
          _SectionHeader(title: 'Badges', icon: Icons.emoji_events, colors: c),
          const SizedBox(height: 12),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _BadgeChip(icon: '🚀', name: 'First Steps', earned: false, colors: c),
              _BadgeChip(icon: '🔥', name: 'On Fire',     earned: false, colors: c),
              _BadgeChip(icon: '💎', name: 'Diamond',     earned: false, colors: c),
              _BadgeChip(icon: '🏆', name: 'Champion',    earned: false, colors: c),
              _BadgeChip(icon: '⚡', name: 'Speed Run',   earned: false, colors: c),
            ],
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, required this.icon, required this.colors});
  final String title;
  final IconData icon;
  final YotColors colors;

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Icon(icon, size: 16, color: colors.accentColor),
      const SizedBox(width: 8),
      Text(title, style: TextStyle(color: colors.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
    ]);
  }
}

class _ProgressRow extends StatelessWidget {
  const _ProgressRow({required this.label, required this.progress, required this.total, required this.colors});
  final String label;
  final int progress;
  final int total;
  final YotColors colors;

  @override
  Widget build(BuildContext context) {
    final pct = total > 0 ? progress / total : 0.0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(label, style: TextStyle(color: colors.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
          Text('$progress/$total', style: TextStyle(color: colors.mutedColor, fontSize: 12)),
        ]),
        const SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: pct,
            backgroundColor: colors.borderColor,
            valueColor: AlwaysStoppedAnimation<Color>(colors.accentColor),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}

class _BadgeChip extends StatelessWidget {
  const _BadgeChip({required this.icon, required this.name, required this.earned, required this.colors});
  final String icon;
  final String name;
  final bool earned;
  final YotColors colors;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: earned ? colors.accentColor.withAlpha(26) : colors.cardColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: earned ? colors.accentColor.withAlpha(102) : colors.borderColor),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Text(icon, style: TextStyle(fontSize: 16, color: earned ? null : const Color(0x88888888))),
        const SizedBox(width: 6),
        Text(name, style: TextStyle(
          color: earned ? colors.textPrimary : colors.mutedColor,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        )),
      ]),
    );
  }
}
