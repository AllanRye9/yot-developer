import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Challenges screen with XP system.
class ChallengesScreen extends StatefulWidget {
  const ChallengesScreen({super.key});
  @override
  State<ChallengesScreen> createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends State<ChallengesScreen> {
  String _filter = 'All';
  final Set<String> _completed = {};
  int _xp = 0;

  static const _filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  static const _challenges = [
    _Challenge(id: 'c1', title: 'Hello Console', difficulty: 'Beginner', category: 'console', xp: 50,
        desc: 'Use console.log to print "Hello, DevTools!" to the console.'),
    _Challenge(id: 'c2', title: 'Time It', difficulty: 'Beginner', category: 'performance', xp: 50,
        desc: 'Use console.time and console.timeEnd to measure code execution.'),
    _Challenge(id: 'c3', title: 'Network Fetch', difficulty: 'Intermediate', category: 'network', xp: 100,
        desc: 'Use the Fetch API to GET data from a public endpoint.'),
    _Challenge(id: 'c4', title: 'DOM Query', difficulty: 'Intermediate', category: 'elements', xp: 100,
        desc: 'Select all button elements and log their text content.'),
    _Challenge(id: 'c5', title: 'Memory Snapshot', difficulty: 'Advanced', category: 'memory', xp: 200,
        desc: 'Identify and fix a memory leak in the provided code snippet.'),
    _Challenge(id: 'c6', title: 'CSP Header', difficulty: 'Advanced', category: 'security', xp: 200,
        desc: 'Write a Content-Security-Policy header that allows only same-origin scripts.'),
  ];

  List<_Challenge> get _filtered =>
      _filter == 'All' ? _challenges : _challenges.where((c) => c.difficulty == _filter).toList();

  int get _level => (_xp ~/ 500) + 1;
  double get _levelProgress => (_xp % 500) / 500.0;

  void _completeChallenge(_Challenge ch) {
    if (_completed.contains(ch.id)) return;
    setState(() {
      _completed.add(ch.id);
      _xp += ch.xp;
    });
    final c = context.yotColors;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(children: [
          const Icon(Icons.emoji_events, color: Colors.amber),
          const SizedBox(width: 8),
          Text('+${ch.xp} XP – ${ch.title} complete!'),
        ]),
        backgroundColor: c.accentColor,
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;
    return Scaffold(
      backgroundColor: c.backgroundColor,
      appBar: AppBar(
        backgroundColor: c.cardColor,
        title: Text('Challenges', style: TextStyle(color: c.textPrimary)),
      ),
      body: CustomScrollView(
        slivers: [
          // Stats + XP bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Stat cards
                  Row(
                    children: [
                      _StatCard(label: 'Level', value: '$_level', color: c.accentColor, colors: c),
                      const SizedBox(width: 10),
                      _StatCard(label: 'XP', value: '$_xp', color: c.warningColor, colors: c),
                      const SizedBox(width: 10),
                      _StatCard(label: 'Done', value: '${_completed.length}/${_challenges.length}', color: c.successColor, colors: c),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // XP progress bar
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Level $_level Progress',
                              style: TextStyle(color: c.mutedColor, fontSize: 12)),
                          Text('${500 - (_xp % 500)} XP to Level ${_level + 1}',
                              style: TextStyle(color: c.mutedColor, fontSize: 12)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: _levelProgress,
                          backgroundColor: c.borderColor,
                          valueColor: AlwaysStoppedAnimation<Color>(c.accentColor),
                          minHeight: 8,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Filter chips
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _filters.map((f) {
                    final selected = _filter == f;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(f),
                        selected: selected,
                        onSelected: (_) => setState(() => _filter = f),
                        selectedColor: c.accentColor,
                        backgroundColor: c.cardColor,
                        labelStyle: TextStyle(
                          color: selected ? Colors.white : c.mutedColor,
                          fontSize: 12,
                        ),
                        side: BorderSide(
                          color: selected ? c.accentColor : c.borderColor,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),

          // Challenge cards
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList.builder(
              itemCount: _filtered.length,
              itemBuilder: (context, i) {
                final ch = _filtered[i];
                final done = _completed.contains(ch.id);
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _ChallengeCard(
                    challenge: ch,
                    isCompleted: done,
                    onTap: () => _completeChallenge(ch),
                  ),
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

class _ChallengeCard extends StatelessWidget {
  const _ChallengeCard({
    required this.challenge,
    required this.isCompleted,
    required this.onTap,
  });
  final _Challenge challenge;
  final bool isCompleted;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;

    Color diffColor = c.mutedColor;
    switch (challenge.difficulty) {
      case 'Beginner':     diffColor = c.successColor; break;
      case 'Intermediate': diffColor = c.accentColor;  break;
      case 'Advanced':     diffColor = c.warningColor; break;
    }

    return Card(
      color: c.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: c.borderColor),
      ),
      elevation: 0,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: isCompleted ? null : onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isCompleted ? c.successColor.withAlpha(26) : c.accentColor.withAlpha(26),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  isCompleted ? Icons.check_circle : Icons.code,
                  size: 20,
                  color: isCompleted ? c.successColor : c.accentColor,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(challenge.title,
                        style: TextStyle(color: c.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(height: 4),
                    Text(challenge.desc,
                        style: TextStyle(color: c.mutedColor, fontSize: 13),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 8),
                    Row(children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: diffColor.withAlpha(26),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: diffColor.withAlpha(77)),
                        ),
                        child: Text(challenge.difficulty,
                            style: TextStyle(color: diffColor, fontSize: 11, fontWeight: FontWeight.w600)),
                      ),
                      const SizedBox(width: 8),
                      Icon(Icons.bolt, size: 13, color: c.warningColor),
                      Text('${challenge.xp} XP',
                          style: TextStyle(color: c.warningColor, fontSize: 12)),
                    ]),
                  ],
                ),
              ),
              if (isCompleted) Icon(Icons.check_circle, color: c.successColor, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value, required this.color, required this.colors});
  final String label;
  final String value;
  final Color color;
  final YotColors colors;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: colors.cardColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colors.borderColor),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(color: colors.mutedColor, fontSize: 11)),
          ],
        ),
      ),
    );
  }
}

class _Challenge {
  const _Challenge({
    required this.id,
    required this.title,
    required this.difficulty,
    required this.category,
    required this.xp,
    required this.desc,
  });
  final String id;
  final String title;
  final String difficulty;
  final String category;
  final int xp;
  final String desc;
}
