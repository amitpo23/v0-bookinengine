// API Route: Audit Logs
// נותן גישה לאדמינים לצפות בלוג אירועי האבטחה

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { auditLogger } from '@/lib/security/audit-log'

export async function GET(request: Request) {
  try {
    // בדוק הרשאות - רק אדמינים
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: בדוק אם המשתמש הוא admin
    // const user = await getUserByEmail(session.user.email)
    // if (user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // שלוף query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined
    const action = searchParams.get('action') as any
    const severity = searchParams.get('severity') as any
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // שלוף לוגים
    const logs = await auditLogger.query({
      userId,
      action,
      severity,
      startDate,
      endDate,
      limit,
      offset,
    })

    // שלוף סטטיסטיקות
    const stats = await auditLogger.getStats(userId)

    return NextResponse.json({
      logs,
      stats,
      count: logs.length,
      offset,
      limit,
    })
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}

// Export audit logs as CSV
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { filters } = body

    const logs = await auditLogger.query(filters)

    // המר ל-CSV
    const headers = [
      'Timestamp',
      'User Email',
      'Action',
      'Severity',
      'Resource',
      'Resource ID',
      'IP Address',
      'Success',
      'Error Message',
    ]

    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userEmail,
      log.action,
      log.severity,
      log.resource,
      log.resourceId || '',
      log.ipAddress,
      log.success ? 'Yes' : 'No',
      log.errorMessage || '',
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Failed to export audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}
