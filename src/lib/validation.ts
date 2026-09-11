const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRequired(value: string, label: string): string | undefined {
  return value.trim() === "" ? `${label} is required.` : undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "Email address is required.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter an email address in the format you@example.com.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (value === "") {
    return "Password is required.";
  }
  if (value.length < 8) {
    return "Use at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Use a mix of letters and numbers.";
  }
  return undefined;
}

export function validateMatch(
  value: string,
  other: string,
  label: string,
): string | undefined {
  if (value === "") {
    return `${label} is required.`;
  }
  return value === other ? undefined : "Both passwords must match.";
}

export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  label: string;
  hint?: string;
  met: number;
  total: number;
}

export interface PasswordRule {
  test: (value: string) => boolean;
  hint: string;
}

const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    test: (value) => value.length >= 8,
    hint: "Use 8+ characters for Strong",
  },
  {
    test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
    hint: "Mix upper and lower case for Strong",
  },
  {
    test: (value) => /[0-9]/.test(value),
    hint: "Include numbers for Strong",
  },
  {
    test: (value) => /[^a-zA-Z0-9]/.test(value),
    hint: "Include symbols for Strong",
  },
];

const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  empty: "Enter a password",
  weak: "Password Strength: Weak",
  fair: "Password Strength: Medium",
  strong: "Password Strength: Strong",
};

export function passwordStrength(value: string): PasswordStrength {
  const met = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  const level: PasswordStrengthLevel =
    value === "" ? "empty" : met <= 1 ? "weak" : met <= 3 ? "fair" : "strong";
  const unmet = PASSWORD_RULES.find((rule) => !rule.test(value));

  return {
    level,
    label: STRENGTH_LABELS[level],
    hint: value === "" ? undefined : unmet?.hint,
    met: value === "" ? 0 : met,
    total: PASSWORD_RULES.length,
  };
}
