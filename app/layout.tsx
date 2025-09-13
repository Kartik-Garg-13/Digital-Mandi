import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import theme from '../lib/theme'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🚜 Digital Mandi - Farmer Marketplace by Kartik Singh',
  description: 'WhatsApp-first digital marketplace for Indian farmers with MSP protection and secure payments',
  keywords: ['farmer', 'marketplace', 'agriculture', 'MSP', 'India', 'digital mandi', 'Kartik Singh'],
  authors: [{ name: 'Kartik Singh - 17 year old BTech CSE student at MUJ' }],
  openGraph: {
    title: '🚜 Digital Mandi - Farmer Marketplace by Kartik Singh',
    description: 'Empowering farmers with direct market access and fair pricing',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2E7D32" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-amber-50">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2E7D32',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
