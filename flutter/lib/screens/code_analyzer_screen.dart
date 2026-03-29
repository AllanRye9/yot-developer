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

  Color _severityColor(_Issue issue) {
    switch (issue.severity) {
      case 'error': return AppTheme.errorColor;
      case 'warning': return AppTheme.warningColor;
      default: return AppTheme.cyanAccent;
    }
  }

  IconData _severityIcon(_Issue issue) {
    switch (issue.severity) {
      case 'error': return Icons.error_outline;
      case 'warning': return Icons.warning_amber_outlined;
      default: return Icons.info_outline;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Code Analyzer')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              flex: 2,
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.cardColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: TextField(
                  controller: _controller,
                  maxLines: null,
                  expands: true,
                  style: const TextStyle(color: AppTheme.textPrimary, fontFamily: 'Courier New', fontSize: 13, height: 1.6),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.all(14),
                    hintText: 'Paste your JavaScript here…',
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
                            const Icon(Icons.check_circle_outline, size: 40, color: AppTheme.successColor),
                            const SizedBox(height: 8),
                            const Text('No issues found', style: TextStyle(color: AppTheme.mutedColor)),
                          ]),
                        )
                      : ListView.separated(
                          itemCount: _issues.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 8),
                          itemBuilder: (_, i) {
                            final issue = _issues[i];
                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: _severityColor(issue).withAlpha(20),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: _severityColor(issue).withAlpha(77)),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(_severityIcon(issue), size: 16, color: _severityColor(issue)),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(issue.message,
                                        style: TextStyle(color: _severityColor(issue), fontSize: 13)),
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
