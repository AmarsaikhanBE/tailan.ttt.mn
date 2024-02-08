export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
