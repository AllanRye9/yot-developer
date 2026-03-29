import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// DOM Inspector screen.
class InspectorScreen extends StatefulWidget {
  const InspectorScreen({super.key});
  @override
  State<InspectorScreen> createState() => _InspectorScreenState();
}

class _InspectorScreenState extends State<InspectorScreen> {
  final _urlController = TextEditingController();
  String? _result;
  bool _loading = false;

  void _inspect() {
    final url = _urlController.text.trim();
    if (url.isEmpty) return;
    setState(() { _loading = true; _result = null; });
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _result = '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>$url</title>\n  </head>\n  <body>\n    <!-- Inspected DOM would appear here -->\n  </body>\n</html>';
      });
    });
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('DOM Inspector')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(children: [
              Expanded(
                child: TextField(
                  controller: _urlController,
                  decoration: const InputDecoration(
                    hintText: 'https://example.com',
                    prefixIcon: Icon(Icons.search, size: 18),
                  ),
                  onSubmitted: (_) => _inspect(),
                  keyboardType: TextInputType.url,
                ),
              ),
              const SizedBox(width: 10),
              ElevatedButton(onPressed: _loading ? null : _inspect, child: const Text('Inspect')),
            ]),
            const SizedBox(height: 16),
            if (_loading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else if (_result != null)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.cardColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      _result!,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontFamily: 'Courier New',
                        fontSize: 12,
                        height: 1.6,
                      ),
                    ),
                  ),
                ),
              )
            else
              Expanded(
                child: Center(
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Icon(Icons.document_scanner_outlined, size: 48, color: AppTheme.mutedColor),
                    const SizedBox(height: 12),
                    const Text('Enter a URL to inspect its DOM', style: TextStyle(color: AppTheme.mutedColor)),
                  ]),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
