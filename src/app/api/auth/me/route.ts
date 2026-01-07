import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/AuthService';

export async function GET(req: Request) {
  try {
    const cookie = (await (req as any).cookies?.get?.('session'))?.value;

    if (!cookie) return NextResponse.json({ user: null }, { status: 200 });

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    
    const user = await auth.getUser(payload.sub);
    
    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.fields.Email,
        ...user.fields
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}