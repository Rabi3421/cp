import { Manrope } from 'next/font/google'
import './globals.css'
import ScrollToTop from '@/app/components/ScrollToTop'
import Aoscompo from '@/utils/aos'
import { AuthProvider } from '@/context/AuthContext'
import ConditionalLayout from '@/app/components/Layout/ConditionalLayout'
const font = Manrope({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <AuthProvider>
          <Aoscompo>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </Aoscompo>
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
