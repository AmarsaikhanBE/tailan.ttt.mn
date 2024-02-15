import type { Metadata } from 'next';
import './globals.css';
import { Provider } from '@/components';

export const metadata: Metadata = {
  title: 'Тавантолгой түлш ХХК',
  description: 'Цахим тайлангийн систем',
};

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="mn">
    <body>
      <Provider>{children}</Provider>
    </body>
  </html>
);
