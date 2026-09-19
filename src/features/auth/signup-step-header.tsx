import { LogoMark } from "@/components/layout/logo-mark";
import { AuthHeader } from "@/features/auth/auth-header";
import { AuthProgress } from "@/features/auth/auth-progress";

export interface SignupStepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
}

export function SignupStepHeader({
  step,
  totalSteps,
  title,
  description,
}: SignupStepHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-5 md:gap-6">
      <LogoMark />
      <AuthProgress current={step} total={totalSteps} />
      <AuthHeader
        variant="display"
        align="center"
        title={title}
        description={description}
      />
    </div>
  );
}
