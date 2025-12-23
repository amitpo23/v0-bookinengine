import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    // Get client IP from headers
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // TODO: Replace with actual database queries
    // Example: const activities = await db.activity.findMany({ orderBy: { timestamp: 'desc' }, take: 50 })
    
    const recentActivity = [
      {
        id: "act_" + Date.now() + "_1",
        type: "book" as const,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        details: "הזמנה חדשה - מלון דן תל אביב, 2 לילות",
        ip: "82.166." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "תל אביב, ישראל",
      },
      {
        id: "act_" + Date.now() + "_2",
        type: "search" as const,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        details: "חיפוש מלונות בירושלים - 15-18 ינואר",
        ip: "37.142." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "ירושלים, ישראל",
      },
      {
        id: "act_" + Date.now() + "_3",
        type: "prebook" as const,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        details: "Pre-book - מלון רויאל ביץ' אילת",
        ip: "109.253." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "חיפה, ישראל",
      },
      {
        id: "act_" + Date.now() + "_4",
        type: "visit" as const,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        details: "כניסה לאתר - עמוד ראשי",
        ip: clientIp,
        location: "גלילה מ-IP",
      },
      {
        id: "act_" + Date.now() + "_5",
        type: "search" as const,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        details: "חיפוש מלונות באילת - סופ״ש הקרוב",
        ip: "31.154." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "באר שבע, ישראל",
      },
      {
        id: "act_" + Date.now() + "_6",
        type: "book" as const,
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        details: "הזמנה חדשה - מלון לאונרדו חיפה, 3 לילות",
        ip: "80.178." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "נתניה, ישראל",
      },
      {
        id: "act_" + Date.now() + "_7",
        type: "visit" as const,
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        details: "כניסה לאתר - דרך חיפוש Google",
        ip: "5.29." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "פתח תקווה, ישראל",
      },
      {
        id: "act_" + Date.now() + "_8",
        type: "search" as const,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        details: "חיפוש מלונות בטבריה - חופשת חנוכה",
        ip: "77.126." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "רעננה, ישראל",
      },
      {
        id: "act_" + Date.now() + "_9",
        type: "prebook" as const,
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        details: "Pre-book - מלון הרודס ים המלח",
        ip: "213.8." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "מודיעין, ישראל",
      },
      {
        id: "act_" + Date.now() + "_10",
        type: "book" as const,
        timestamp: new Date(Date.now() - 40 * 60 * 1000),
        details: "הזמנה חדשה - מלון פרימה פארק ירושלים, 1 לילה",
        ip: "185.224." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
        location: "הרצליה, ישראל",
      },
    ];

    return NextResponse.json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
