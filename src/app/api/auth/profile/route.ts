import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/AuthService';

export async function PATCH(req: Request) {
  try {
    const cookie = (await (req as any).cookies?.get?.('session'))?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    const userId = payload.sub;

    const data = await req.json();

    const forbidden = [
      'id',
      'Email',
      'email',
      'PasswordHash',
      'CreatedAt',
    ];
    const updatableFields = Object.keys(data)
      .filter(key => !forbidden.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    const updated = await auth.updateProfile(userId, updatableFields);

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookie = (await (req as any).cookies?.get?.('session'))?.value;
    if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    const userId = payload.sub;

    await auth.deleteAccount(userId);

    const response = NextResponse.json({ success: true });
    response.cookies.delete('session');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
