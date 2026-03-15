import type { Metadata } from 'next'
import ThemeRegistry from '@/lib/ThemeRegistry'

export const metadata: Metadata = {
  title: 'Quiz Time',
  description: 'Test your knowledge with trivia questions from Open Trivia DB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
