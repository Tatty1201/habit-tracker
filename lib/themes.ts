// スキン（テーマ）定義 - 背景・アクセントカラーのパターン

export interface Theme {
  id: string
  name: string
  preview: {
    bg: string // プレビュー用の色（background）
    accent: string // プレビュー用の色（アクセント）
  }
}

export const THEMES: Theme[] = [
  {
    id: "lime",
    name: "ネオンライム",
    preview: { bg: "#0a0a0a", accent: "#84cc16" },
  },
  {
    id: "ocean",
    name: "オーシャンブルー",
    preview: { bg: "#0a0a0a", accent: "#0ea5e9" },
  },
  {
    id: "sunset",
    name: "サンセット",
    preview: { bg: "#0a0a0a", accent: "#f97316" },
  },
  {
    id: "lavender",
    name: "ラベンダー",
    preview: { bg: "#0a0a0a", accent: "#a855f7" },
  },
  {
    id: "coral",
    name: "コーラル",
    preview: { bg: "#0a0a0a", accent: "#ec4899" },
  },
  {
    id: "mint",
    name: "ミント",
    preview: { bg: "#0a0a0a", accent: "#14b8a6" },
  },
]

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id)
}
