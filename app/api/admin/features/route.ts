import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FeatureConfig, DEFAULT_FEATURE_CONFIG } from '@/types/features';

// GET - קבלת קונפיגורציית Features
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: טען מ-Database (Supabase)
    // לעת עתה, החזר את הקונפיגורציה הדיפולטית
    return NextResponse.json(DEFAULT_FEATURE_CONFIG);
  } catch (error) {
    console.error('Error fetching features config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features config' },
      { status: 500 }
    );
  }
}

// POST - שמירת קונפיגורציית Features
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // בדוק הרשאות - רק ADMIN או SUPER_ADMIN
    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config: FeatureConfig = await request.json();

    // TODO: שמור ב-Database (Supabase)
    // לעת עתה, פשוט החזר את הקונפיגורציה
    console.log('Saving features config:', config);

    return NextResponse.json({ 
      success: true, 
      config 
    });
  } catch (error) {
    console.error('Error saving features config:', error);
    return NextResponse.json(
      { error: 'Failed to save features config' },
      { status: 500 }
    );
  }
}

// PUT - עדכון חלקי של קונפיגורציה
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // בדוק הרשאות
    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();

    // TODO: עדכן רק את השדות שהשתנו ב-Database
    console.log('Updating features config:', updates);

    return NextResponse.json({ 
      success: true, 
      updates 
    });
  } catch (error) {
    console.error('Error updating features config:', error);
    return NextResponse.json(
      { error: 'Failed to update features config' },
      { status: 500 }
    );
  }
}
