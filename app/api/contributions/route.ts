import { NextResponse } from 'next/server';
import { getContributions } from '@/lib/github';

export async function GET(request: Request) {
    const year = Number(new URL(request.url).searchParams.get('year'));

    if (!Number.isInteger(year) || year < 2008 || year > new Date().getUTCFullYear()) {
        return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    const calendar = await getContributions(year);
    return NextResponse.json(calendar);
}
