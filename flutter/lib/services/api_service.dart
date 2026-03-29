import 'dart:convert';
import 'package:http/http.dart' as http;

/// Base URL for the YOT Developer Next.js API.
/// In production, point this at the deployed server.
const String _baseUrl = 'https://yot-developer.vercel.app/api';

/// Thin wrapper around package:http that communicates with the
/// Next.js API routes exposed by the web app.
class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  // ─── Headers ──────────────────────────────────────
  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // ─── Generic helpers ──────────────────────────────

  /// GET request – returns the decoded JSON body or throws [ApiException].
  Future<dynamic> get(String path, {Map<String, String>? queryParams}) async {
    final uri = Uri.parse('$_baseUrl$path').replace(queryParameters: queryParams);
    final response = await _client.get(uri, headers: _headers);
    return _handleResponse(response);
  }

  /// POST request – sends [body] as JSON and returns the decoded response.
  Future<dynamic> post(String path, Map<String, dynamic> body) async {
    final uri = Uri.parse('$_baseUrl$path');
    final response = await _client.post(
      uri,
      headers: _headers,
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return jsonDecode(response.body);
    }
    throw ApiException(
      statusCode: response.statusCode,
      message: _tryParseError(response.body),
    );
  }

  String _tryParseError(String body) {
    try {
      final decoded = jsonDecode(body) as Map<String, dynamic>;
      return decoded['error'] as String? ?? decoded['message'] as String? ?? body;
    } catch (_) {
      return body;
    }
  }

  // ─── Site-tester endpoint ─────────────────────────

  /// Runs security / header analysis for [url].
  /// Returns a [SiteTestResult] or throws [ApiException].
  Future<SiteTestResult> testSite(String url) async {
    final data = await post('/site-test', {'url': url}) as Map<String, dynamic>;
    return SiteTestResult.fromJson(data);
  }

  void dispose() => _client.close();
}

// ─── Domain models ────────────────────────────────────

class SiteTestResult {
  const SiteTestResult({
    required this.url,
    required this.statusCode,
    required this.headers,
    required this.checks,
    required this.score,
  });

  final String url;
  final int statusCode;
  final Map<String, String> headers;
  final List<SecurityCheck> checks;
  final int score;

  factory SiteTestResult.fromJson(Map<String, dynamic> json) {
    return SiteTestResult(
      url: json['url'] as String? ?? '',
      statusCode: (json['statusCode'] as num?)?.toInt() ?? 0,
      headers: Map<String, String>.from(json['headers'] as Map? ?? {}),
      checks: (json['checks'] as List? ?? [])
          .map((e) => SecurityCheck.fromJson(e as Map<String, dynamic>))
          .toList(),
      score: (json['score'] as num?)?.toInt() ?? 0,
    );
  }
}

class SecurityCheck {
  const SecurityCheck({
    required this.name,
    required this.passed,
    required this.description,
    this.value,
  });

  final String name;
  final bool passed;
  final String description;
  final String? value;

  factory SecurityCheck.fromJson(Map<String, dynamic> json) {
    return SecurityCheck(
      name: json['name'] as String? ?? '',
      passed: json['passed'] as bool? ?? false,
      description: json['description'] as String? ?? '',
      value: json['value'] as String?,
    );
  }
}

// ─── Error type ───────────────────────────────────────

class ApiException implements Exception {
  const ApiException({required this.statusCode, required this.message});
  final int statusCode;
  final String message;

  @override
  String toString() => 'ApiException($statusCode): $message';
}
