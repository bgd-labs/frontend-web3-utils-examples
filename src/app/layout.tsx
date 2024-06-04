import { Inter, Space_Grotesk } from 'next/font/google';

import WagmiConfigProviderWrapper from '../providers/WagmiProvider';
import { ZustandStoreProvider } from '../providers/ZustandStoreProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['700'],
});

export const metadata = {
  title: 'BGD - web3 app',
  description: 'Basic web3 app with trpc, next.js, and drizzle-orm',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${spaceGrotesk.variable}`}>
        <ZustandStoreProvider>
          <WagmiConfigProviderWrapper />
          {children}
        </ZustandStoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
