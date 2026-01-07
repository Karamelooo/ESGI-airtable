import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/services/auth/AuthService';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parseResult = bodySchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parseResult.data;

    const auth = new AuthService();
    const { token, user } = await auth.signup(email, password);

    const res = NextResponse.json({ user });
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}