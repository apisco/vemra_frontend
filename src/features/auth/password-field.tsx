import { Input } from "@/components/ui/input";
import type { InputProps } from "@/components/ui/input";
import { PasswordStrengthMeter } from "@/features/auth/password-strength";
import { cn } from "@/lib/cn";

export interface PasswordFieldProps extends Omit<InputProps, "type"> {
  strengthValue?: string;
  wrapperClassName?: string;
}

export function PasswordField({
  strengthValue,
  wrapperClassName,
  showPasswordToggle = true,
  ...props
}: PasswordFieldProps) {
  const field = (
    <Input {...props} type="password" showPasswordToggle={showPasswordToggle} />
  );

  if (strengthValue === undefined) {
    return field;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {field}
      <PasswordStrengthMeter value={strengthValue} />
    </div>
  );
}
