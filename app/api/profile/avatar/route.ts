import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { verifyToken } from '@/lib/auth';
import { db, safeQuery } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.email) return null;
  const user = await db.getUserByEmail(payload.email);
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Ensure avatar_url column exists
    await safeQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');

    const form = await req.formData();
    const file = form.get('avatar');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (<= 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Validate type
    const mime = file.type || '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(mime)) {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 });
    }

    const ext = mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg';
    const fileName = `${user.id}-${Date.now()}${ext}`;
    const publicDir = path.join(process.cwd(), 'public', 'avatars');
    const filePath = path.join(publicDir, fileName);

    // Ensure directory exists (best-effort)
    await fs.mkdir(publicDir, { recursive: true }).catch(()=>{});

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/avatars/${fileName}`;
    await safeQuery('UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [publicUrl, user.id]);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}
