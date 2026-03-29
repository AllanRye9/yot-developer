import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';

/// Playground screen – write and run JavaScript snippets.
class PlaygroundScreen extends StatefulWidget {
  const PlaygroundScreen({super.key});
  @override
  State<PlaygroundScreen> createState() => _PlaygroundScreenState();
}

class _PlaygroundScreenState extends State<PlaygroundScreen> {
  final _controller = TextEditingController(
    text: '// Write your JavaScript here\nconsole.log("Hello from YOT!");\n',
  );
  final List<String> _output = [];
  bool _running = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _run() {
    setState(() {
      _running = true;
      _output.clear();
    });
    // Simulate execution delay
    Future.delayed(const Duration(milliseconds: 400), () {
      if (!mounted) return;
      setState(() {
        _running = false;
        _output.addAll([
          '> Code submitted to server for execution.',
          '> Hello from YOT!',
        ]);
      });
    });
  }

  void _copy() {
    Clipboard.setData(ClipboardData(text: _controller.text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Code copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Playground'),
        actions: [
          IconButton(icon: const Icon(Icons.copy), onPressed: _copy, tooltip: 'Copy code'),
        ],
      ),
      body: Column(
        children: [
          // Editor
          Expanded(
            flex: 3,
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.cardColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: const BoxDecoration(
                      border: Border(bottom: BorderSide(color: AppTheme.borderColor)),
                    ),
                    child: Row(
                      children: [
                        const Text('editor.js', style: TextStyle(color: AppTheme.mutedColor, fontSize: 12, fontFamily: 'Courier New')),
                        const Spacer(),
                        Container(width: 10, height: 10, decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle)),
                        const SizedBox(width: 5),
                        Container(width: 10, height: 10, decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle)),
                        const SizedBox(width: 5),
                        Container(width: 10, height: 10, decoration: const BoxDecoration(color: AppTheme.successColor, shape: BoxShape.circle)),
                      ],
                    ),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      maxLines: null,
                      expands: true,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontFamily: 'Courier New',
                        fontSize: 13,
                        height: 1.6,
                      ),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.all(14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Run button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _running ? null : _run,
                icon: _running
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.play_arrow, size: 18),
                label: Text(_running ? 'Running…' : 'Run Code'),
              ),
            ),
          ),

          // Output
          Expanded(
            flex: 2,
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.cardColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.fromLTRB(14, 8, 14, 8),
                    child: Text('Output', style: TextStyle(color: AppTheme.mutedColor, fontSize: 12, fontFamily: 'Courier New')),
                  ),
                  const Divider(height: 1, color: AppTheme.borderColor),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _output.isEmpty ? 1 : _output.length,
                      itemBuilder: (_, i) {
                        if (_output.isEmpty) {
                          return const Text(
                            'Run your code to see output',
                            style: TextStyle(color: AppTheme.mutedColor, fontFamily: 'Courier New', fontSize: 13),
                          );
                        }
                        final line = _output[i];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            line,
                            style: TextStyle(
                              color: line.startsWith('Error') ? AppTheme.errorColor : AppTheme.textPrimary,
                              fontFamily: 'Courier New',
                              fontSize: 13,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
