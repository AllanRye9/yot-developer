/// Core data models shared across all screens.

// ─── Challenge ────────────────────────────────────────

enum DifficultyLevel { beginner, intermediate, advanced }

class Challenge {
  const Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.category,
    required this.startingCode,
    required this.solution,
    required this.hint,
    required this.expectedKeywords,
    required this.xpReward,
  });

  final String id;
  final String title;
  final String description;
  final DifficultyLevel difficulty;
  final String category;
  final String startingCode;
  final String solution;
  final String hint;
  final List<String> expectedKeywords;
  final int xpReward;

  factory Challenge.fromJson(Map<String, dynamic> json) {
    return Challenge(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      difficulty: DifficultyLevel.values.firstWhere(
        (d) => d.name == (json['difficulty'] as String).toLowerCase(),
        orElse: () => DifficultyLevel.beginner,
      ),
      category: json['category'] as String,
      startingCode: json['startingCode'] as String,
      solution: json['solution'] as String,
      hint: json['hint'] as String,
      expectedKeywords: List<String>.from(json['expectedKeywords'] as List),
      xpReward: (json['xpReward'] as num).toInt(),
    );
  }
}

// ─── User progress ────────────────────────────────────

class UserProgress {
  const UserProgress({
    required this.completedIds,
    required this.xp,
  });

  final List<String> completedIds;
  final int xp;

  int get level => (xp ~/ 500) + 1;
  int get xpInLevel => xp % 500;
  int get xpToNextLevel => 500 - xpInLevel;
  double get levelProgress => xpInLevel / 500.0;

  UserProgress copyWith({List<String>? completedIds, int? xp}) {
    return UserProgress(
      completedIds: completedIds ?? this.completedIds,
      xp: xp ?? this.xp,
    );
  }

  factory UserProgress.fromJson(Map<String, dynamic> json) {
    return UserProgress(
      completedIds: List<String>.from(json['completed'] as List? ?? []),
      xp: (json['xp'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'completed': completedIds,
        'xp': xp,
      };

  static UserProgress get empty => const UserProgress(completedIds: [], xp: 0);
}

// ─── Badge ────────────────────────────────────────────

class Badge {
  const Badge({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
  });

  final String id;
  final String name;
  final String description;
  final String icon;
}

// ─── DevTools category ────────────────────────────────

class DevToolsCategory {
  const DevToolsCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.examples,
  });

  final String id;
  final String name;
  final String description;
  final String icon;
  final List<CodeExample> examples;
}

class CodeExample {
  const CodeExample({
    required this.title,
    required this.description,
    required this.code,
  });

  final String title;
  final String description;
  final String code;
}
