import '/styles/globals.css';
export const metadata = {
  title: 'Anrapp',
  description: 'Aplikasi Anrapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>

    </html>
  )
}
