module.exports=[96277,56775,34556,e=>{"use strict";let n={id:"hotel-search",name:"Hotel Search",nameHe:"חיפוש מלונות",description:"Search for available hotels with real-time pricing and availability",descriptionHe:"חיפוש מלונות זמינים עם תמחור וזמינות בזמן אמת",category:"booking",capabilities:["search"],isEnabled:!0,priority:1,requiredPermissions:["booking:read"],tools:[{name:"search_hotels",description:"Search for available hotel rooms with pricing. Use when user asks about hotel availability, prices, or wants to find accommodation.",parameters:[{name:"destination",type:"string",description:"City or destination name",required:!0},{name:"checkIn",type:"date",description:"Check-in date (YYYY-MM-DD)",required:!0},{name:"checkOut",type:"date",description:"Check-out date (YYYY-MM-DD)",required:!0},{name:"adults",type:"number",description:"Number of adults",required:!0,default:2},{name:"children",type:"array",description:"Array of children ages",required:!1,default:[]},{name:"stars",type:"array",description:"Filter by star rating (1-5)",required:!1},{name:"maxPrice",type:"number",description:"Maximum price per night",required:!1},{name:"amenities",type:"array",description:"Required amenities",required:!1}],handler:"lib/ai-engines/handlers/booking.searchHotels",isAsync:!0,timeout:3e4,retryConfig:{maxRetries:3,delayMs:1e3,exponentialBackoff:!0}}]},i={id:"hotel-prebook",name:"Hotel Pre-booking",nameHe:"הזמנה מוקדמת",description:"Pre-book a room to confirm availability and lock the price",descriptionHe:"הזמנה מוקדמת לחדר לאישור זמינות ונעילת מחיר",category:"booking",capabilities:["prebook"],isEnabled:!0,priority:2,requiredPermissions:["booking:write"],tools:[{name:"prebook_room",description:"Pre-book a room to confirm availability before final booking. Use after user selects a specific room.",parameters:[{name:"roomCode",type:"string",description:"Room code from search results",required:!0},{name:"hotelId",type:"string",description:"Hotel ID from search results",required:!0},{name:"checkIn",type:"date",description:"Check-in date",required:!0},{name:"checkOut",type:"date",description:"Check-out date",required:!0},{name:"guests",type:"object",description:"Guest configuration { adults, children }",required:!0}],handler:"lib/ai-engines/handlers/booking.prebookRoom",isAsync:!0,timeout:3e4}]},t={id:"hotel-booking",name:"Hotel Booking",nameHe:"הזמנת מלון",description:"Complete hotel booking with customer details and payment",descriptionHe:"השלמת הזמנת מלון עם פרטי לקוח ותשלום",category:"booking",capabilities:["booking"],isEnabled:!0,priority:3,requiredPermissions:["booking:write","payment:process"],tools:[{name:"book_room",description:"Complete the booking with customer details. Use only after pre-booking and when you have all customer information.",parameters:[{name:"token",type:"string",description:"Token from pre-book response",required:!0},{name:"roomCode",type:"string",description:"Room code",required:!0},{name:"customer",type:"object",description:"Customer details { firstName, lastName, email, phone, address }",required:!0},{name:"guests",type:"array",description:"Guest list with names",required:!0},{name:"specialRequests",type:"string",description:"Special requests",required:!1}],handler:"lib/ai-engines/handlers/booking.bookRoom",isAsync:!0,timeout:6e4}]},r={id:"booking-cancellation",name:"Booking Cancellation",nameHe:"ביטול הזמנה",description:"Cancel existing bookings with policy information",descriptionHe:"ביטול הזמנות קיימות עם מידע על מדיניות הביטול",category:"booking",capabilities:["cancellation"],isEnabled:!0,priority:4,requiredPermissions:["booking:cancel"],tools:[{name:"cancel_booking",description:"Cancel an existing booking. Requires confirmation from customer.",parameters:[{name:"bookingId",type:"string",description:"Booking confirmation number",required:!0},{name:"reason",type:"string",description:"Cancellation reason",required:!1},{name:"force",type:"boolean",description:"Force cancellation even with penalties",required:!1,default:!1}],handler:"lib/ai-engines/handlers/booking.cancelBooking",isAsync:!0,timeout:3e4},{name:"get_cancellation_policy",description:"Get cancellation policy and potential penalties for a booking.",parameters:[{name:"bookingId",type:"string",description:"Booking confirmation number",required:!0}],handler:"lib/ai-engines/handlers/booking.getCancellationPolicy",isAsync:!0}]},a={id:"price-monitoring",name:"Price Monitoring",nameHe:"מעקב מחירים",description:"Monitor and track hotel prices over time, detect price drops",descriptionHe:"מעקב אחר מחירי מלונות לאורך זמן, זיהוי ירידות מחירים",category:"analysis",capabilities:["price-monitoring","analytics"],isEnabled:!0,priority:5,requiredPermissions:["monitoring:read","monitoring:write"],tools:[{name:"track_hotel_price",description:"Start tracking price for a specific hotel and date range.",parameters:[{name:"hotelUrl",type:"string",description:"Hotel URL (Booking.com)",required:!0},{name:"checkIn",type:"date",description:"Check-in date",required:!0},{name:"checkOut",type:"date",description:"Check-out date",required:!0},{name:"targetPrice",type:"number",description:"Alert when price drops below",required:!1},{name:"notifyEmail",type:"string",description:"Email for price alerts",required:!1}],handler:"lib/ai-engines/handlers/monitoring.trackHotelPrice",isAsync:!0},{name:"get_price_history",description:"Get historical price data for a hotel.",parameters:[{name:"hotelId",type:"string",description:"Hotel ID",required:!0},{name:"dateFrom",type:"date",description:"Start date for history",required:!0},{name:"dateTo",type:"date",description:"End date for history",required:!0}],handler:"lib/ai-engines/handlers/monitoring.getPriceHistory",isAsync:!0},{name:"analyze_price_trends",description:"Analyze price trends and predict best booking time.",parameters:[{name:"hotelId",type:"string",description:"Hotel ID",required:!0},{name:"travelDates",type:"object",description:"Travel date range { from, to }",required:!0}],handler:"lib/ai-engines/handlers/monitoring.analyzePriceTrends",isAsync:!0}]},o={id:"voice-interaction",name:"Voice Interaction",nameHe:"אינטראקציה קולית",description:"Handle voice calls with speech-to-text and text-to-speech",descriptionHe:"טיפול בשיחות קוליות עם המרת דיבור לטקסט וטקסט לדיבור",category:"communication",capabilities:["voice-interaction","real-time-streaming"],isEnabled:!0,priority:1,requiredPermissions:["voice:read","voice:write"],tools:[{name:"initiate_call",description:"Initiate an outbound phone call to customer.",parameters:[{name:"phoneNumber",type:"string",description:"Phone number to call (E.164 format)",required:!0},{name:"purpose",type:"string",description:"Call purpose/script",required:!0},{name:"language",type:"string",description:"Call language",required:!1,default:"he-IL"}],handler:"lib/ai-engines/handlers/voice.initiateCall",isAsync:!0,timeout:12e4},{name:"transfer_to_human",description:"Transfer the call to a human agent.",parameters:[{name:"reason",type:"string",description:"Transfer reason",required:!0},{name:"agentQueue",type:"string",description:"Target agent queue",required:!1}],handler:"lib/ai-engines/handlers/voice.transferToHuman",isAsync:!0},{name:"send_call_summary_sms",description:"Send SMS summary after call ends.",parameters:[{name:"phoneNumber",type:"string",description:"Phone number",required:!0},{name:"summary",type:"string",description:"Call summary text",required:!0}],handler:"lib/ai-engines/handlers/voice.sendCallSummarySms",isAsync:!0}]},s={id:"sms-integration",name:"SMS Integration",nameHe:"אינטגרציית SMS",description:"Send and receive SMS messages for booking confirmations and updates",descriptionHe:"שליחה וקבלת הודעות SMS לאישורי הזמנות ועדכונים",category:"communication",capabilities:["sms-integration"],isEnabled:!0,priority:2,requiredPermissions:["sms:send"],tools:[{name:"send_sms",description:"Send SMS message to customer.",parameters:[{name:"phoneNumber",type:"string",description:"Phone number (E.164)",required:!0},{name:"message",type:"string",description:"Message content",required:!0},{name:"template",type:"string",description:"Template ID",required:!1}],handler:"lib/ai-engines/handlers/sms.sendSms",isAsync:!0},{name:"send_booking_confirmation_sms",description:"Send booking confirmation SMS with details.",parameters:[{name:"bookingId",type:"string",description:"Booking ID",required:!0},{name:"phoneNumber",type:"string",description:"Phone number",required:!0}],handler:"lib/ai-engines/handlers/sms.sendBookingConfirmation",isAsync:!0}]},l={id:"email-integration",name:"Email Integration",nameHe:"אינטגרציית אימייל",description:"Send booking confirmations and marketing emails",descriptionHe:"שליחת אישורי הזמנות ואימיילים שיווקיים",category:"communication",capabilities:["email-integration"],isEnabled:!0,priority:3,requiredPermissions:["email:send"],tools:[{name:"send_booking_email",description:"Send booking confirmation email.",parameters:[{name:"bookingId",type:"string",description:"Booking ID",required:!0},{name:"recipientEmail",type:"string",description:"Recipient email",required:!0}],handler:"lib/ai-engines/handlers/email.sendBookingEmail",isAsync:!0},{name:"send_cancellation_email",description:"Send cancellation confirmation email.",parameters:[{name:"bookingId",type:"string",description:"Booking ID",required:!0},{name:"recipientEmail",type:"string",description:"Recipient email",required:!0}],handler:"lib/ai-engines/handlers/email.sendCancellationEmail",isAsync:!0}]},c={id:"web-search",name:"Web Search",nameHe:"חיפוש באינטרנט",description:"Search the web for travel information, reviews, and recommendations",descriptionHe:"חיפוש באינטרנט למידע על נסיעות, ביקורות והמלצות",category:"research",capabilities:["web-search"],isEnabled:!0,priority:1,requiredPermissions:["search:web"],tools:[{name:"search_web",description:"Search the web for travel-related information.",parameters:[{name:"query",type:"string",description:"Search query",required:!0},{name:"type",type:"string",description:"Search type: general, news, reviews",required:!1,default:"general"},{name:"limit",type:"number",description:"Number of results",required:!1,default:5}],handler:"lib/ai-engines/handlers/research.searchWeb",isAsync:!0},{name:"get_destination_info",description:"Get comprehensive information about a travel destination.",parameters:[{name:"destination",type:"string",description:"Destination name",required:!0},{name:"topics",type:"array",description:"Topics: weather, attractions, safety, cuisine",required:!1}],handler:"lib/ai-engines/handlers/research.getDestinationInfo",isAsync:!0}]},d={id:"knowledge-base",name:"Knowledge Base",nameHe:"בסיס ידע",description:"Retrieve information from internal knowledge base using RAG",descriptionHe:"אחזור מידע מבסיס ידע פנימי באמצעות RAG",category:"research",capabilities:["rag-retrieval","knowledge-base"],isEnabled:!0,priority:2,requiredPermissions:["knowledge:read"],tools:[{name:"search_knowledge_base",description:"Search internal knowledge base for relevant information.",parameters:[{name:"query",type:"string",description:"Search query",required:!0},{name:"category",type:"string",description:"Knowledge category",required:!1},{name:"topK",type:"number",description:"Number of results",required:!1,default:5}],handler:"lib/ai-engines/handlers/knowledge.searchKnowledgeBase",isAsync:!0},{name:"get_faq_answer",description:"Get answer to frequently asked question.",parameters:[{name:"question",type:"string",description:"The question",required:!0}],handler:"lib/ai-engines/handlers/knowledge.getFaqAnswer",isAsync:!0}]},p={id:"market-analysis",name:"Market Analysis",nameHe:"ניתוח שוק",description:"Analyze hotel market, competition, and pricing trends",descriptionHe:"ניתוח שוק מלונות, תחרות ומגמות תמחור",category:"analysis",capabilities:["analytics"],isEnabled:!0,priority:3,requiredPermissions:["analytics:read"],tools:[{name:"analyze_competition",description:"Analyze competitor hotels and their pricing.",parameters:[{name:"hotelId",type:"string",description:"Target hotel ID",required:!0},{name:"radius",type:"number",description:"Radius in km",required:!1,default:5}],handler:"lib/ai-engines/handlers/analysis.analyzeCompetition",isAsync:!0},{name:"get_seasonality_insights",description:"Get seasonality and demand insights for a destination.",parameters:[{name:"destination",type:"string",description:"Destination",required:!0},{name:"year",type:"number",description:"Year",required:!1}],handler:"lib/ai-engines/handlers/analysis.getSeasonalityInsights",isAsync:!0},{name:"get_upcoming_events",description:"Get upcoming events that may affect hotel demand.",parameters:[{name:"destination",type:"string",description:"Destination",required:!0},{name:"dateRange",type:"object",description:"Date range { from, to }",required:!0}],handler:"lib/ai-engines/handlers/analysis.getUpcomingEvents",isAsync:!0}]},m={id:"user-preferences",name:"User Preferences",nameHe:"העדפות משתמש",description:"Learn and apply user preferences for personalized recommendations",descriptionHe:"לימוד ויישום העדפות משתמש להמלצות מותאמות אישית",category:"personalization",capabilities:["analytics"],isEnabled:!0,priority:1,requiredPermissions:["user:read","user:write"],tools:[{name:"get_user_preferences",description:"Get stored user preferences.",parameters:[{name:"userId",type:"string",description:"User ID",required:!0}],handler:"lib/ai-engines/handlers/personalization.getUserPreferences",isAsync:!0},{name:"update_user_preferences",description:"Update user preferences based on interactions.",parameters:[{name:"userId",type:"string",description:"User ID",required:!0},{name:"preferences",type:"object",description:"Preferences to update",required:!0}],handler:"lib/ai-engines/handlers/personalization.updateUserPreferences",isAsync:!0},{name:"get_personalized_recommendations",description:"Get hotel recommendations based on user preferences and history.",parameters:[{name:"userId",type:"string",description:"User ID",required:!0},{name:"destination",type:"string",description:"Destination",required:!0},{name:"dates",type:"object",description:"Travel dates",required:!0}],handler:"lib/ai-engines/handlers/personalization.getRecommendations",isAsync:!0}]},g={id:"loyalty-program",name:"Loyalty Program",nameHe:"תוכנית נאמנות",description:"Manage loyalty points, rewards, and member benefits",descriptionHe:"ניהול נקודות נאמנות, תגמולים והטבות חברים",category:"personalization",capabilities:["analytics"],isEnabled:!0,priority:2,requiredPermissions:["loyalty:read","loyalty:write"],tools:[{name:"get_loyalty_balance",description:"Get loyalty points balance and tier status.",parameters:[{name:"userId",type:"string",description:"User ID",required:!0}],handler:"lib/ai-engines/handlers/loyalty.getLoyaltyBalance",isAsync:!0},{name:"redeem_points",description:"Redeem loyalty points for rewards.",parameters:[{name:"userId",type:"string",description:"User ID",required:!0},{name:"points",type:"number",description:"Points to redeem",required:!0},{name:"rewardType",type:"string",description:"Reward type",required:!0}],handler:"lib/ai-engines/handlers/loyalty.redeemPoints",isAsync:!0},{name:"apply_member_discount",description:"Apply member discount to booking.",parameters:[{name:"bookingId",type:"string",description:"Booking ID",required:!0},{name:"userId",type:"string",description:"User ID",required:!0}],handler:"lib/ai-engines/handlers/loyalty.applyMemberDiscount",isAsync:!0}]},u=[n,i,t,r,a,o,s,l,c,d,p,m,g],h=e=>u.find(n=>n.id===e);e.s(["allSkills",0,u,"bookingCancellationSkill",0,r,"emailIntegrationSkill",0,l,"getSkillById",0,h,"hotelBookingSkill",0,t,"hotelPrebookSkill",0,i,"hotelSearchSkill",0,n,"knowledgeBaseSkill",0,d,"loyaltyProgramSkill",0,g,"marketAnalysisSkill",0,p,"priceMonitoringSkill",0,a,"smsIntegrationSkill",0,s,"userPreferencesSkill",0,m,"voiceInteractionSkill",0,o,"webSearchSkill",0,c],56775);let y=[{id:"hotel-booking-engine",type:"hotel-booking",name:"Hotel Booking Engine",nameHe:"מנוע הזמנות מלון",description:"Complete hotel booking agent with search, prebook, and booking capabilities",descriptionHe:"סוכן הזמנות מלון מלא עם יכולות חיפוש, הזמנה מוקדמת והזמנה",version:"1.0.0",skills:[n,i,t,r,l],capabilities:["search","prebook","booking","cancellation","email-integration"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.7,maxTokens:4096,topP:.9},persona:{name:"Alex",nameHe:"אלכס",role:"Senior Booking Agent",roleHe:"סוכן הזמנות בכיר",personality:["professional","helpful","efficient","knowledgeable"],communicationStyle:"friendly-professional",expertise:["hotel bookings","travel planning","customer service","negotiation"],languages:["en","he","ar"]},prompts:{systemPrompt:`You are Alex, a senior hotel booking agent. Your role is to help customers find and book the perfect hotel accommodations.

CORE RESPONSIBILITIES:
1. Search for hotels based on customer requirements
2. Present options clearly with pricing and key features
3. Guide customers through the booking process
4. Handle special requests and preferences
5. Provide cancellation and modification assistance

BOOKING FLOW:
1. Gather requirements: destination, dates, guests, preferences
2. Search for available hotels using search_hotels
3. Present top 3-5 options with key details
4. When customer selects, use prebook_room to confirm availability
5. Collect customer details and complete booking with book_room
6. Send confirmation email

GUIDELINES:
- Always confirm dates and guest count before searching
- Present prices clearly in the customer's preferred currency
- Highlight included amenities and cancellation policies
- Be proactive about loyalty discounts and promotions
- Escalate complex issues to human agents

LANGUAGE: Respond in the same language the customer uses.`,systemPromptHe:`אתה אלכס, סוכן הזמנות מלון בכיר. תפקידך לעזור ללקוחות למצוא ולהזמין את המלון המושלם.

תחומי אחריות:
1. חיפוש מלונות לפי דרישות הלקוח
2. הצגת אפשרויות ברורה עם מחירים ותכונות
3. ליווי לקוחות בתהליך ההזמנה
4. טיפול בבקשות מיוחדות
5. סיוע בביטולים ושינויים

הנחיות:
- תמיד אשר תאריכים ומספר אורחים לפני חיפוש
- הצג מחירים בבירור
- הדגש מדיניות ביטול
- הציע הנחות נאמנות ומבצעים`,greetingMessage:"Hello! I'm Alex, your booking assistant. How can I help you find the perfect hotel today?",greetingMessageHe:`שלום! אני אלכס, עוזר ההזמנות שלך. איך אוכל לעזור לך למצוא את המלון המושלם?`,errorMessages:{noResults:"I couldn't find any hotels matching your criteria. Would you like to adjust your dates or try a different destination?",bookingFailed:"There was an issue completing your booking. Let me try again or connect you with a specialist.",timeout:"The search is taking longer than expected. Please wait a moment.",general:"Something went wrong. Let me help you with that."}},config:{maxConversationTurns:50,contextWindowSize:20,enableMemory:!0,enableLogging:!0,logLevel:"info",enableAnalytics:!0,responseTimeout:3e4,autoSave:!0},integrations:{crm:{enabled:!0,provider:"supabase",syncCustomers:!0,syncBookings:!0},payment:{enabled:!0,provider:"stripe",supportedMethods:["card","apple_pay","google_pay"]},analytics:{enabled:!0,provider:"custom",trackConversations:!0,trackBookings:!0}}},{id:"travel-agent-engine",type:"travel-agent",name:"Travel Agent Engine",nameHe:"מנוע סוכן נסיעות",description:"Comprehensive travel planning with destination expertise and personalized recommendations",descriptionHe:"תכנון נסיעות מקיף עם מומחיות ביעדים והמלצות מותאמות אישית",version:"1.0.0",skills:[n,i,t,c,d,m,g,l],capabilities:["search","prebook","booking","web-search","rag-retrieval","analytics"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.8,maxTokens:4096,topP:.95},persona:{name:"Maya",nameHe:"מאיה",role:"Travel Expert",roleHe:"מומחית נסיעות",personality:["enthusiastic","knowledgeable","creative","adventurous"],communicationStyle:"warm-engaging",expertise:["destination planning","local experiences","cultural insights","travel tips"],languages:["en","he","es","fr"]},prompts:{systemPrompt:`You are Maya, an experienced travel expert with deep knowledge of destinations worldwide.

YOUR MISSION:
Help travelers create unforgettable experiences by providing personalized recommendations, insider tips, and seamless booking assistance.

EXPERTISE AREAS:
- Destination knowledge: local customs, best seasons, hidden gems
- Accommodation matching: finding the perfect hotel for each traveler
- Experience planning: activities, restaurants, cultural events
- Budget optimization: getting the most value for every trip

CONVERSATION APPROACH:
1. Understand the traveler's style (adventure, relaxation, culture, family)
2. Learn about their preferences and past experiences
3. Provide tailored destination recommendations
4. Share insider tips and local knowledge
5. Help book accommodations that match their style
6. Create a personalized trip overview

PERSONALITY:
- Share personal travel stories when relevant
- Be enthusiastic about destinations
- Offer creative and unique suggestions
- Consider sustainability and responsible travel

Remember to use web search for current events, weather, and local happenings.`,greetingMessage:`Hi there! I'm Maya, your travel expert. I absolutely love helping people discover amazing destinations. Whether you're dreaming of pristine beaches, mountain adventures, or vibrant city escapes - I'm here to make it happen! 🌍

What kind of travel experience are you looking for?`,greetingMessageHe:`היי! אני מאיה, מומחית הנסיעות שלך. אני פשוט אוהבת לעזור לאנשים לגלות יעדים מדהימים. בין אם אתה חולם על חופים, הרפתקאות בהרים או בריחה לעיר תוססת - אני כאן לגרום לזה לקרות! 🌍

איזה סוג חוויית טיול מעניין אותך?`},config:{maxConversationTurns:100,contextWindowSize:30,enableMemory:!0,enableLogging:!0,logLevel:"info",enableAnalytics:!0}},{id:"concierge-engine",type:"concierge",name:"Hotel Concierge Engine",nameHe:"מנוע קונסיירז'",description:"In-stay hotel concierge for guest services and local recommendations",descriptionHe:"קונסיירז' מלון לשירותי אורחים והמלצות מקומיות",version:"1.0.0",skills:[c,d,s,m],capabilities:["web-search","rag-retrieval","sms-integration"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.6,maxTokens:2048},persona:{name:"James",nameHe:"ג'יימס",role:"Head Concierge",roleHe:"ראש הקונסיירז'",personality:["sophisticated","attentive","resourceful","discrete"],communicationStyle:"formal-elegant",expertise:["local dining","entertainment","transportation","special requests"],languages:["en","he","fr","it","de"]},prompts:{systemPrompt:`You are James, the head concierge at a luxury hotel. You provide impeccable service and have extensive local knowledge.

SERVICES YOU PROVIDE:
- Restaurant reservations and recommendations
- Transportation arrangements
- Entertainment and event tickets
- Local tours and experiences
- Special occasion arrangements
- Room service coordination
- Guest requests and amenities

STANDARDS:
- Maintain the highest level of professionalism
- Anticipate guest needs before they ask
- Know the best local establishments personally
- Handle all requests with discretion
- Provide multiple options when possible

COMMUNICATION STYLE:
- Formal yet warm
- Never say "no" - always offer alternatives
- Confirm all arrangements in detail
- Follow up on guest satisfaction`,greetingMessage:"Good day. I'm James, your concierge. It's my pleasure to assist you during your stay. How may I be of service?",greetingMessageHe:`יום טוב. אני ג'יימס, הקונסיירז' שלך. זה לשמחתי לסייע לך במהלך השהייה. במה אוכל לעזור?`}},{id:"voice-agent-engine",type:"voice-agent",name:"Voice Booking Agent",nameHe:"סוכן הזמנות קולי",description:"Voice-enabled agent for phone-based hotel bookings",descriptionHe:"סוכן קולי להזמנות מלון טלפוניות",version:"1.0.0",skills:[n,i,t,o,s],capabilities:["search","prebook","booking","voice-interaction","sms-integration"],modelConfig:{provider:"openai",model:"gpt-4o-realtime",temperature:.7,maxTokens:1024},persona:{name:"Sam",nameHe:"סם",role:"Voice Booking Specialist",roleHe:"מומחה הזמנות קולי",personality:["clear","patient","efficient","friendly"],communicationStyle:"conversational-clear",expertise:["phone bookings","audio clarity","efficient communication"],languages:["en","he"]},prompts:{systemPrompt:`You are Sam, a voice booking specialist. You handle phone calls for hotel reservations.

VOICE INTERACTION GUIDELINES:
1. Speak clearly and at a moderate pace
2. Confirm information by repeating back key details
3. Use phonetic spelling for names and confirmation numbers
4. Break down complex information into digestible parts
5. Allow pauses for customer responses

CALL FLOW:
1. Greet warmly and identify yourself
2. Determine if new booking, modification, or cancellation
3. Gather requirements step by step
4. Confirm all details before proceeding
5. Provide confirmation number clearly
6. Offer to send SMS summary

AUDIO CONSIDERATIONS:
- Keep sentences short
- Avoid jargon
- Spell out important codes: "That's B as in Bravo, O as in Oscar..."
- Always confirm numbers: "That's 972-50-1234567, correct?"

End calls with clear next steps and gratitude.`,greetingMessage:"Thank you for calling! This is Sam, your booking assistant. How can I help you today?",greetingMessageHe:`תודה שהתקשרת! כאן סם, עוזר ההזמנות שלך. איך אוכל לעזור לך היום?`},voice:{enabled:!0,provider:"azure",sttLanguage:"he-IL",ttsVoice:"he-IL-HilaNeural",interimResults:!0,vadSensitivity:.5,silenceTimeout:2e3}},{id:"price-monitor-engine",type:"price-monitor",name:"Price Monitor Engine",nameHe:"מנוע מעקב מחירים",description:"Automated price monitoring with alerts and trend analysis",descriptionHe:"מעקב מחירים אוטומטי עם התראות וניתוח מגמות",version:"1.0.0",skills:[a,p,l,s],capabilities:["price-monitoring","analytics","email-integration","sms-integration"],modelConfig:{provider:"groq",model:"llama-3.1-8b-instant",temperature:.3,maxTokens:2048},persona:{name:"Atlas",nameHe:"אטלס",role:"Price Analyst",roleHe:"אנליסט מחירים",personality:["analytical","precise","data-driven","proactive"],communicationStyle:"informative-concise",expertise:["price analysis","market trends","deal detection","timing optimization"]},prompts:{systemPrompt:`You are Atlas, a price monitoring specialist. You track hotel prices and help users book at the best time.

CAPABILITIES:
1. Track prices for specific hotels and dates
2. Analyze historical pricing patterns
3. Predict optimal booking windows
4. Alert users to significant price drops
5. Compare prices across multiple properties

DATA-DRIVEN INSIGHTS:
- Present data clearly with percentages and comparisons
- Identify patterns: weekday vs weekend, seasonal trends
- Factor in events that affect pricing
- Consider cancellation policy value in pricing

ALERTS:
- Immediate alert for drops > 15%
- Daily summary for tracked hotels
- Weekly trend reports
- Expiring deal notifications

Be concise and factual. Present numbers clearly.`,greetingMessage:"Hello! I'm Atlas, your price monitoring assistant. I can help you track hotel prices and find the best deals. What would you like to monitor?",greetingMessageHe:`שלום! אני אטלס, עוזר מעקב המחירים שלך. אני יכול לעזור לך לעקוב אחר מחירי מלונות ולמצוא את העסקאות הטובות ביותר. מה תרצה לעקוב?`}},{id:"support-agent-engine",type:"support-agent",name:"Customer Support Engine",nameHe:"מנוע תמיכת לקוחות",description:"Customer support agent for booking issues, complaints, and inquiries",descriptionHe:"סוכן תמיכת לקוחות לבעיות הזמנה, תלונות ובירורים",version:"1.0.0",skills:[r,d,l,s],capabilities:["cancellation","rag-retrieval","email-integration","sms-integration"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.5,maxTokens:2048},persona:{name:"Sophie",nameHe:"סופי",role:"Customer Support Specialist",roleHe:"מומחית תמיכת לקוחות",personality:["empathetic","patient","solution-oriented","calm"],communicationStyle:"understanding-helpful",expertise:["issue resolution","policy expertise","de-escalation","customer advocacy"],languages:["en","he","ar","ru"]},prompts:{systemPrompt:`You are Sophie, a customer support specialist. You handle booking issues with empathy and efficiency.

ISSUE HANDLING PRIORITIES:
1. Acknowledge the customer's concern immediately
2. Apologize sincerely when appropriate
3. Take ownership of the issue
4. Find the best possible solution
5. Follow up to ensure satisfaction

COMMON ISSUES:
- Booking modifications and cancellations
- Refund requests and processing
- Complaint resolution
- Policy clarification
- Escalation to hotel/management

COMMUNICATION APPROACH:
- Always validate the customer's feelings
- Never be defensive
- Offer solutions, not excuses
- Be transparent about limitations
- Under-promise and over-deliver

ESCALATION CRITERIA:
- Unresolved after 3 attempts
- Customer explicitly requests supervisor
- Legal/safety concerns
- High-value customer at risk

Document all issues and resolutions carefully.`,greetingMessage:"Hello, I'm Sophie from customer support. I'm here to help you with any concerns about your booking. What can I assist you with today?",greetingMessageHe:`שלום, אני סופי מתמיכת הלקוחות. אני כאן לעזור לך עם כל שאלה או בעיה בנוגע להזמנה שלך. במה אוכל לסייע?`},handoff:{enableHandoff:!0,handoffTriggers:["speak to human","supervisor","manager","escalate","דבר עם אדם","מנהל"],targetEngines:["voice-agent-engine"],handoffMessage:"I'll connect you with a specialist who can help further. Please hold.",handoffMessageHe:"אחבר אותך למומחה שיוכל לעזור יותר. אנא המתן."}},{id:"group-booking-engine",type:"group-booking",name:"Group Booking Engine",nameHe:"מנוע הזמנות קבוצתיות",description:"Specialized agent for corporate and group hotel bookings",descriptionHe:"סוכן מתמחה בהזמנות מלון לחברות וקבוצות",version:"1.0.0",skills:[n,i,t,p,l],capabilities:["search","prebook","booking","analytics","email-integration"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.6,maxTokens:4096},persona:{name:"David",nameHe:"דוד",role:"Corporate Sales Manager",roleHe:"מנהל מכירות לעסקים",personality:["professional","negotiator","strategic","relationship-focused"],communicationStyle:"business-professional",expertise:["corporate travel","group rates","contract negotiation","event planning"],languages:["en","he"]},prompts:{systemPrompt:`You are David, a corporate sales manager specializing in group and business travel.

GROUP BOOKING EXPERTISE:
1. Conference and event accommodations
2. Corporate rate negotiations
3. Multiple room blocks
4. Meeting room requirements
5. Group amenities and services

DISCOVERY PROCESS:
- Company/Organization name
- Event type and purpose
- Number of rooms needed
- Date flexibility
- Budget constraints
- Meeting room requirements
- Special requests (dietary, accessibility)

NEGOTIATION POINTS:
- Volume discounts (typically 10+ rooms)
- Complimentary upgrades
- Meeting room rates
- Breakfast inclusions
- Cancellation flexibility
- Payment terms

Provide itemized quotes and comparison options.`,greetingMessage:"Hello, I'm David from our corporate booking team. I specialize in group and business travel arrangements. Whether you're planning a conference, corporate retreat, or team event, I'm here to find the perfect solution. What brings you to us today?",greetingMessageHe:`שלום, אני דוד מצוות ההזמנות לעסקים. אני מתמחה בהזמנות קבוצתיות ונסיעות עסקים. בין אם אתה מתכנן כנס, יום גיבוש או אירוע צוות - אני כאן למצוא את הפתרון המושלם. מה מביא אותך אלינו?`}},{id:"orchestrator-engine",type:"multi-agent",name:"Multi-Agent Orchestrator",nameHe:"מתזמר רב-סוכנים",description:"Orchestrates conversations across multiple specialized agents",descriptionHe:"מתזמר שיחות בין סוכנים מתמחים שונים",version:"1.0.0",skills:[d],capabilities:["multi-agent","rag-retrieval"],modelConfig:{provider:"groq",model:"llama-3.3-70b-versatile",temperature:.3,maxTokens:1024},persona:{name:"Nexus",nameHe:"נקסוס",role:"Conversation Director",roleHe:"מנהל שיחות",personality:["efficient","organized","adaptive"],communicationStyle:"adaptive"},prompts:{systemPrompt:`You are Nexus, the conversation orchestrator. Your role is to analyze user requests and route them to the appropriate specialist agent.

AVAILABLE AGENTS:
1. Alex (hotel-booking) - New bookings and reservations
2. Maya (travel-agent) - Travel planning and recommendations
3. James (concierge) - In-stay services and local recommendations
4. Sam (voice-agent) - Phone-based interactions
5. Atlas (price-monitor) - Price tracking and deal alerts
6. Sophie (support-agent) - Issues and complaints
7. David (group-booking) - Corporate and group bookings

ROUTING LOGIC:
- Analyze the user's intent
- Select the most appropriate agent
- Provide context to the receiving agent
- Monitor for handoff needs during conversation

HANDOFF TRIGGERS:
- Topic change requiring different expertise
- Explicit user request
- Escalation from specialized agent
- Multi-domain queries (coordinate agents)

Keep the conversation seamless - users shouldn't feel the agent change unless necessary.`,greetingMessage:"Welcome! I'm here to connect you with the right specialist. Are you looking to book a hotel, plan a trip, get help with an existing reservation, or something else?",greetingMessageHe:`ברוכים הבאים! אני כאן לחבר אותך למומחה הנכון. האם אתה מחפש להזמין מלון, לתכנן טיול, לקבל עזרה עם הזמנה קיימת, או משהו אחר?`},handoff:{enableHandoff:!0,handoffTriggers:["new booking","plan trip","existing booking","issue","group","price alert"],targetEngines:["hotel-booking-engine","travel-agent-engine","concierge-engine","support-agent-engine","group-booking-engine","price-monitor-engine"]}}];e.s(["allTemplates",0,y],34556);class f{engines=new Map;activeConversations=new Map;toolHandlers=new Map;constructor(){this.initializeDefaultEngines()}initializeDefaultEngines(){y.forEach(e=>{let n=this.createEngineInstance(e);this.engines.set(n.instanceId,n)}),console.log(`[AIEngineManager] Initialized ${this.engines.size} engine instances`)}createEngineInstance(e,n){let i={...e,...n},t=[];return i.skills.forEach(e=>{e.isEnabled&&t.push(...e.tools)}),{instanceId:`${i.id}-${Date.now()}`,template:i,status:"active",createdAt:new Date,activeConversations:0,totalConversations:0,tools:t,metadata:{version:i.version,templateId:i.id}}}getEngine(e){return this.engines.get(e)}getAllEngines(){return Array.from(this.engines.values())}getEnginesByType(e){return Array.from(this.engines.values()).filter(n=>n.template.type===e)}getActiveEngines(){return Array.from(this.engines.values()).filter(e=>"active"===e.status)}startConversation(e,n,i,t){let r=this.engines.get(e);if(!r)return console.error(`[AIEngineManager] Engine not found: ${e}`),null;let a=`conv-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,o={conversationId:a,engineInstanceId:e,userId:n,sessionId:i||a,startedAt:new Date,lastActivityAt:new Date,messageCount:0,currentIntent:void 0,extractedEntities:{},bookingData:{},preferences:{},metadata:t||{}};return this.activeConversations.set(a,o),r.activeConversations++,r.totalConversations++,console.log(`[AIEngineManager] Started conversation ${a} with engine ${r.template.name}`),o}getConversation(e){return this.activeConversations.get(e)}updateConversation(e,n){let i=this.activeConversations.get(e);if(!i)return null;let t={...i,...n,lastActivityAt:new Date};return this.activeConversations.set(e,t),t}endConversation(e){let n=this.activeConversations.get(e);if(!n)return;let i=this.engines.get(n.engineInstanceId);i&&(i.activeConversations=Math.max(0,i.activeConversations-1)),this.activeConversations.delete(e),console.log(`[AIEngineManager] Ended conversation ${e}`)}registerToolHandler(e,n){this.toolHandlers.set(e,n)}async executeTool(e,n,i){let t;for(let n of u)if(t=n.tools.find(n=>n.name===e))break;if(!t)return{success:!1,error:`Tool not found: ${e}`};let r=this.toolHandlers.get(t.handler);if(!r)return console.warn(`[AIEngineManager] Handler not registered: ${t.handler}`),{success:!0,result:{message:`[Mock] Tool ${e} executed with params`,parameters:n}};try{let e=await r(n,i);return{success:!0,result:e}}catch(e){return console.error("[AIEngineManager] Tool execution error:",e),{success:!1,error:e.message}}}getEngineTools(e){let n=this.engines.get(e);if(!n)return[];let i=[];return n.template.skills.forEach(e=>{e.isEnabled&&i.push(...e.tools)}),i}formatToolsForLLM(e){return this.getEngineTools(e).map(e=>({type:"function",function:{name:e.name,description:e.description,parameters:{type:"object",properties:e.parameters.reduce((e,n)=>(e[n.name]={type:"date"===n.type?"string":n.type,description:n.description},n.enum&&(e[n.name].enum=n.enum),e),{}),required:e.parameters.filter(e=>e.required).map(e=>e.name)}}}))}shouldTriggerHandoff(e,n){let i=this.engines.get(n.engineInstanceId);if(!i?.template.handoff?.enableHandoff)return{shouldHandoff:!1};let t=i.template.handoff,r=e.toLowerCase();for(let e of t.handoffTriggers||[])if(r.includes(e.toLowerCase()))return{shouldHandoff:!0,targetEngine:this.determineHandoffTarget(e,t),reason:`Triggered by phrase: "${e}"`};return{shouldHandoff:!1}}determineHandoffTarget(e,n){let i=n.targetEngines||[];if(0===i.length)return;let t=e.toLowerCase();return t.includes("book")||t.includes("הזמנ")?i.find(e=>e.includes("booking")):t.includes("support")||t.includes("issue")||t.includes("problem")?i.find(e=>e.includes("support")):t.includes("group")||t.includes("corporate")||t.includes("קבוצ")?i.find(e=>e.includes("group")):t.includes("price")||t.includes("מחיר")?i.find(e=>e.includes("price")):i[0]}async executeHandoff(e,n){let i,t=this.activeConversations.get(e);if(!t)return{success:!1,error:"Conversation not found"};for(let e of this.engines.values())if(e.template.id===n||e.instanceId===n){i=e;break}if(!i)return{success:!1,error:`Target engine not found: ${n}`};let r=this.startConversation(i.instanceId,t.userId,t.sessionId,{...t.metadata,handoffFrom:t.engineInstanceId,previousContext:{extractedEntities:t.extractedEntities,bookingData:t.bookingData,preferences:t.preferences}});if(!r)return{success:!1,error:"Failed to create new conversation"};r.extractedEntities={...t.extractedEntities},r.bookingData={...t.bookingData},r.preferences={...t.preferences},this.endConversation(e);let a=i.template.handoff?.handoffMessage||`I'm connecting you with our ${i.template.persona?.role||"specialist"} who can better assist you.`;return console.log(`[AIEngineManager] Handoff executed: ${t.engineInstanceId} -> ${i.instanceId}`),{success:!0,newContext:r,handoffMessage:a}}updateEngineConfig(e,n){let i=this.engines.get(e);return i?(i.template={...i.template,...n},i.lastModified=new Date,i):null}toggleEngineSkill(e,n,i){let t=this.engines.get(e);if(!t)return!1;let r=t.template.skills.find(e=>e.id===n);return!!r&&(r.isEnabled=i,t.lastModified=new Date,!0)}addSkillToEngine(e,n){let i=this.engines.get(e);if(!i)return!1;let t=h(n);return!(!t||i.template.skills.some(e=>e.id===n))&&(i.template.skills.push({...t}),i.lastModified=new Date,!0)}setEngineStatus(e,n){let i=this.engines.get(e);return!!i&&(i.status=n,i.lastModified=new Date,!0)}getEngineStats(e){if(e){let n=this.engines.get(e);return n?{instanceId:n.instanceId,name:n.template.name,type:n.template.type,status:n.status,activeConversations:n.activeConversations,totalConversations:n.totalConversations,skillCount:n.template.skills.length,toolCount:n.tools.length,createdAt:n.createdAt,lastModified:n.lastModified}:{}}let n=Array.from(this.engines.values());return{totalEngines:n.length,activeEngines:n.filter(e=>"active"===e.status).length,totalActiveConversations:n.reduce((e,n)=>e+n.activeConversations,0),totalConversations:n.reduce((e,n)=>e+n.totalConversations,0),enginesByType:n.reduce((e,n)=>(e[n.template.type]=(e[n.template.type]||0)+1,e),{})}}getConversationAnalytics(e){let n=Array.from(this.activeConversations.values()),i=n;return e&&(i=n.filter(n=>n.startedAt>=e.from&&n.startedAt<=e.to)),{activeConversations:i.length,averageMessageCount:i.reduce((e,n)=>e+n.messageCount,0)/i.length||0,conversationsByEngine:i.reduce((e,n)=>(e[n.engineInstanceId]=(e[n.engineInstanceId]||0)+1,e),{}),intents:i.reduce((e,n)=>(n.currentIntent&&(e[n.currentIntent]=(e[n.currentIntent]||0)+1),e),{})}}}let b=null;function v(){return b||(b=new f),b}e.s(["getAIEngineManager",()=>v],96277)}];

//# sourceMappingURL=lib_ai-engines_engine-manager_ts_a711dd68._.js.map