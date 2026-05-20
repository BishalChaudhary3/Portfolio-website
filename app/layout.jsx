// app/layout.jsx
import '../styles/globals.css';
import '../styles/timeline.css';
import '../styles/animations.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { Toaster } from 'react-hot-toast';
import BackgroundEffect from '@/components/ui/BackgroundEffect';

export const metadata = {
  title: 'Bishal Chaudhary | Full Stack Developer Portfolio',
  description: 'Professional portfolio showcasing amazing projects and skills in web development',
  keywords: 'portfolio, full stack developer, web developer, react, next.js',
  authors: [{ name: 'Bishal Chaudhary' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Premium Background Layer */}
        <BackgroundEffect />

        <ThemeProvider>
          <AuthProvider>
            <VisitorProvider>
              {/* Main Content */}
              <div className="relative z-10">
                {children}
              </div>
              <Toaster position="bottom-right" />
            </VisitorProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}