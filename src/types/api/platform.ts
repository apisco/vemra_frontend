export interface PlatformStat {
  id: string;
  label: string;
  value: string;
}

export interface PlatformStats {
  stats: readonly PlatformStat[];
}

export interface PreviewRow {
  label: string;
  value: string;
  isEmphasised: boolean;
}

export interface PreviewProgress {
  label: string;
  value: string;
  percent: number;
}

export interface PreviewPanel {
  title: string;
  badge: string;
  rows: readonly PreviewRow[];
  progress: PreviewProgress | null;
}

export interface DashboardPreview {
  tenant: PreviewPanel;
  landlord: PreviewPanel;
}
