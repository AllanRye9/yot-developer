import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

/// Security / Site Tester screen – calls the Next.js API to test a URL.
class SiteTesterScreen extends StatefulWidget {
  const SiteTesterScreen({super.key});
  @override
  State<SiteTesterScreen> createState() => _SiteTesterScreenState();
}

class _SiteTesterScreenState extends State<SiteTesterScreen> {
  final _urlController = TextEditingController();
  SiteTestResult? _result;
  bool _loading = false;
  String? _error;

  Future<void> _testSite() async {
    final url = _urlController.text.trim();
    if (url.isEmpty) return;
    setState(() { _loading = true; _result = null; _error = null; });

    try {
      final api = context.read<ApiService>();
      final result = await api.testSite(url);
      if (!mounted) return;
      setState(() { _result = result; _loading = false; });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() { _error = e.message; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.yotColors;
    return Scaffold(
      backgroundColor: c.backgroundColor,
      appBar: AppBar(
        backgroundColor: c.cardColor,
        title: Text('Security Tester', style: TextStyle(color: c.textPrimary)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // URL input
            Row(children: [
              Expanded(
                child: TextField(
                  controller: _urlController,
                  decoration: InputDecoration(
                    hintText: 'https://example.com',
                    prefixIcon: Icon(Icons.security, size: 18, color: c.mutedColor),
                  ),
                  onSubmitted: (_) => _testSite(),
                  keyboardType: TextInputType.url,
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(onPressed: _loading ? null : _testSite, child: const Text('Test')),
            ]),
            const SizedBox(height: 20),

            if (_loading) const Expanded(child: Center(child: CircularProgressIndicator()))

            else if (_error != null)
              Expanded(child: Center(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: c.errorColor.withAlpha(20),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: c.errorColor.withAlpha(77)),
                  ),
                  child: Row(children: [
                    Icon(Icons.error_outline, color: c.errorColor),
                    const SizedBox(width: 10),
                    Expanded(child: Text(_error!, style: TextStyle(color: c.errorColor))),
                  ]),
                ),
              ))

            else if (_result != null)
              Expanded(child: _ResultView(result: _result!, colors: c))

            else
              Expanded(child: Center(
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Icon(Icons.shield_outlined, size: 56, color: c.mutedColor),
                  const SizedBox(height: 14),
                  Text('Enter a URL to test its security headers',
                      style: TextStyle(color: c.mutedColor),
                      textAlign: TextAlign.center),
                ]),
              )),
          ],
        ),
      ),
    );
  }
}

class _ResultView extends StatelessWidget {
  const _ResultView({required this.result, required this.colors});
  final SiteTestResult result;
  final YotColors colors;

  @override
  Widget build(BuildContext context) {
    final passed = result.checks.where((c) => c.passed).length;
    final total = result.checks.length;

    return Column(
      children: [
        // Score
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: colors.cardColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: colors.borderColor),
          ),
          child: Row(children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Score', style: TextStyle(color: colors.mutedColor, fontSize: 12)),
              Text('${result.score}/100',
                  style: TextStyle(color: colors.textPrimary, fontSize: 28, fontWeight: FontWeight.bold)),
            ]),
            const SizedBox(width: 16),
            Expanded(child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: result.score / 100,
                backgroundColor: colors.borderColor,
                valueColor: AlwaysStoppedAnimation<Color>(
                  result.score >= 70 ? colors.successColor : colors.errorColor,
                ),
                minHeight: 8,
              ),
            )),
          ]),
        ),
        const SizedBox(height: 14),
        Text('$passed / $total checks passed',
            style: TextStyle(color: colors.mutedColor, fontSize: 13)),
        const SizedBox(height: 12),
        Expanded(
          child: ListView.separated(
            itemCount: result.checks.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (_, i) {
              final check = result.checks[i];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: check.passed ? colors.successColor.withAlpha(20) : colors.errorColor.withAlpha(20),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: check.passed ? colors.successColor.withAlpha(77) : colors.errorColor.withAlpha(77),
                  ),
                ),
                child: Row(children: [
                  Icon(
                    check.passed ? Icons.check_circle_outline : Icons.cancel_outlined,
                    size: 16,
                    color: check.passed ? colors.successColor : colors.errorColor,
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(check.name,
                        style: TextStyle(color: colors.textPrimary, fontWeight: FontWeight.w600, fontSize: 13)),
                    if (check.description.isNotEmpty)
                      Text(check.description,
                          style: TextStyle(color: colors.mutedColor, fontSize: 12)),
                  ])),
                ]),
              );
            },
          ),
        ),
      ],
    );
  }
}

// Expose SiteTestResult from api_service.dart for use above.
export '../services/api_service.dart' show SiteTestResult;
