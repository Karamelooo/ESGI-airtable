import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/AuthService';

export type Req = Request & {
  cookies?: {
    get?: (name: string) => { value: string } | undefined;
  };
};

export async function GET(req: Req) {
  try {
    const cookie = (await req.cookies?.get?.('session'))?.value;

    if (!cookie) return NextResponse.json({ user: null }, { status: 200 });

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    return NextResponse.json({ user: { id: payload.sub, email: payload.email } });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}