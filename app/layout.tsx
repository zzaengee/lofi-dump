import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "lofi dump.",
  description: "thoughts & images — seoul, kr",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
