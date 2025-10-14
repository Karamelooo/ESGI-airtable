import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/services/auth/AuthService';
import { LikesService } from '@/services/likes/LikesService';
import { Req } from '../auth/me/route';

const toggleLikeSchema = z.object({
  contentId: z.string(),
});

const getLikeStatusSchema = z.object({
  contentId: z.string(),
});

export async function POST(req: Req) {
  try {
    const cookie = (await req.cookies?.get?.('session'))?.value;
    if (!cookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    const userId = payload.sub;

    const json = await req.json();
    const { contentId } = toggleLikeSchema.parse(json);

    const likesService = new LikesService();
    const result = await likesService.toggleLike(userId, contentId);

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Req) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json({ error: 'contentId requis' }, { status: 400 });
    }
    const cookie = (await req.cookies?.get?.('session'))?.value;
    if (!cookie) {
      const likesService = new LikesService();
      const count = await likesService.getLikesCount(contentId);
      return NextResponse.json({ liked: false, count });
    }

    const auth = new AuthService();
    const payload = auth.verify(cookie);
    const userId = payload.sub;

    const likesService = new LikesService();
    const result = await likesService.getLikeStatus(userId, contentId);

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}