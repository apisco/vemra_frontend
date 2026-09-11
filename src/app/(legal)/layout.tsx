import { LegalFooter } from "@/features/legal/legal-footer";
import { LegalHeader } from "@/features/legal/legal-header";

export default function LegalLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <LegalHeader />
      <main className="flex-1">{children}</main>
      <LegalFooter />
    </>
  );
}
