import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const excludeId = searchParams.get('excludeId');

  if (!slug) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const supabase = await createClient();
  let query = supabase
    .from('invitations')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return NextResponse.json({ available: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ available: !data });
}
