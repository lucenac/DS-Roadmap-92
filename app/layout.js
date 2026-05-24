import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProgressProvider } from '@/contexts/ProgressContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DS Roadmap 92',
  description: 'Acompanhe seu progresso de estudos em Ciência de Dados',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
