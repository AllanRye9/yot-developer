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
    final c = context.yotColors;
    return Scaffold(
      backgroundColor: c.backgroundColor,
      appBar: AppBar(
        backgroundColor: c.cardColor,
        title: Text('Playground', style: TextStyle(color: c.textPrimary)),
        actions: [
          IconButton(
            icon: Icon(Icons.copy, color: c.mutedColor),
            onPressed: _copy,
            tooltip: 'Copy code',
          ),
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
                color: c.cardColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      border: Border(bottom: BorderSide(color: c.borderColor)),
                    ),
                    child: Row(
                      children: [
                        Text(
                          'editor.js',
                          style: TextStyle(
                            color: c.mutedColor,
                            fontSize: 12,
                            fontFamily: 'Courier New',
                          ),
                        ),
                        const Spacer(),
                        Container(width: 10, height: 10, decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle)),
                        const SizedBox(width: 5),
                        Container(width: 10, height: 10, decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle)),
                        const SizedBox(width: 5),
                        Container(width: 10, height: 10, decoration: BoxDecoration(color: c.successColor, shape: BoxShape.circle)),
                      ],
                    ),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      maxLines: null,
                      expands: true,
                      style: TextStyle(
                        color: c.textPrimary,
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
                color: c.cardColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: c.borderColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(14, 8, 14, 8),
                    child: Text(
                      'Output',
                      style: TextStyle(
                        color: c.mutedColor,
                        fontSize: 12,
                        fontFamily: 'Courier New',
                      ),
                    ),
                  ),
                  Divider(height: 1, color: c.borderColor),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _output.isEmpty ? 1 : _output.length,
                      itemBuilder: (_, i) {
                        if (_output.isEmpty) {
                          return Text(
                            'Run your code to see output',
                            style: TextStyle(
                              color: c.mutedColor,
                              fontFamily: 'Courier New',
                              fontSize: 13,
                            ),
                          );
                        }
                        final line = _output[i];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            line,
                            style: TextStyle(
                              color: line.startsWith('Error') ? c.errorColor : c.textPrimary,
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
