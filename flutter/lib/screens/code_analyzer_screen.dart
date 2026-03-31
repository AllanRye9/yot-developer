import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Code Analyzer screen.
class CodeAnalyzerScreen extends StatefulWidget {
  const CodeAnalyzerScreen({super.key});
  @override
  State<CodeAnalyzerScreen> createState() => _CodeAnalyzerScreenState();
}

class _CodeAnalyzerScreenState extends State<CodeAnalyzerScreen> {
  final _controller = TextEditingController();
  List<_Issue> _issues = [];
  bool _loading = false;

  void _analyze() {
    final code = _controller.text.trim();
    if (code.isEmpty) return;
    setState(() { _loading = true; _issues = []; });
    Future.delayed(const Duration(milliseconds: 700), () {
      if (!mounted) return;
      final found = <_Issue>[];
      if (code.contains('eval(')) {
        found.add(const _Issue(severity: 'error', message: "Avoid eval() – it can execute arbitrary code.", line: 0));
      }
      if (code.contains('var ')) {
        found.add(const _Issue(severity: 'warning', message: "Prefer const/let over var for block scoping.", line: 0));
      }
      if (!code.contains('use strict') && code.length > 20) {
        found.add(const _Issue(severity: 'info', message: "Consider adding 'use strict' at the top of your script.", line: 0));
      }
      setState(() { _loading = false; _issues = found; });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;

    Color severityColor(_Issue issue) {
      switch (issue.severity) {
        case 'error':   return c.errorColor;
        case 'warning': return c.warningColor;
        default:        return c.cyanAccent;
      }
    }

    IconData severityIcon(_Issue issue) {
      switch (issue.severity) {
        case 'error':   return Icons.error_outline;
        case 'warning': return Icons.warning_amber_outlined;
        default:        return Icons.info_outline;
      }
    }

    return Scaffold(
      backgroundColor: c.backgroundColor,
      appBar: AppBar(
        backgroundColor: c.cardColor,
        title: Text('Code Analyzer', style: TextStyle(color: c.textPrimary)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              flex: 2,
              child: Container(
                decoration: BoxDecoration(
                  color: c.cardColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: c.borderColor),
                ),
                child: TextField(
                  controller: _controller,
                  maxLines: null,
                  expands: true,
                  style: TextStyle(color: c.textPrimary, fontFamily: 'Courier New', fontSize: 13, height: 1.6),
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.all(14),
                    hintText: 'Paste your JavaScript here…',
                    hintStyle: TextStyle(color: c.mutedColor),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _loading ? null : _analyze,
                icon: _loading
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.search, size: 18),
                label: Text(_loading ? 'Analyzing…' : 'Analyze Code'),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              flex: 2,
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _issues.isEmpty
                      ? Center(
                          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                            Icon(Icons.check_circle_outline, size: 40, color: c.successColor),
                            const SizedBox(height: 8),
                            Text('No issues found', style: TextStyle(color: c.mutedColor)),
                          ]),
                        )
                      : ListView.separated(
                          itemCount: _issues.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 8),
                          itemBuilder: (_, i) {
                            final issue = _issues[i];
                            final color = severityColor(issue);
                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: color.withAlpha(20),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: color.withAlpha(77)),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(severityIcon(issue), size: 16, color: color),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(issue.message,
                                        style: TextStyle(color: color, fontSize: 13)),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Issue {
  const _Issue({required this.severity, required this.message, required this.line});
  final String severity;
  final String message;
  final int line;
}
