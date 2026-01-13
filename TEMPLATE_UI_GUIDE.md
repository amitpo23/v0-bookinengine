# 🎨 מדריך שימוש - קומפוננטות UI משופרות לטמפלטים

## קומפוננטות זמינות

### 1. EnhancedLoadingOverlay
מסך טעינה מונפש עם skeleton loaders

```tsx
import { EnhancedLoadingOverlay } from '@/components/templates/enhanced-ui'

<EnhancedLoadingOverlay
  isLoading={booking.isLoading}
  variant="light" // או "dark"
/>
```

**תכונות:**
- ✅ אנימציות Framer Motion
- ✅ Skeleton preview
- ✅ Progress indicators
- ✅ תמיכה ב-light/dark modes

---

### 2. showToast
Toast notifications מקצועיות

```tsx
import { showToast } from '@/components/templates/enhanced-ui'

// Success
showToast.success('הזמנה הושלמה!', 'נשלח אליך אישור במייל')

// Error
showToast.error('שגיאה בתשלום', 'נסה שוב מאוחר יותר')

// Warning
showToast.warning('תשומת לב', 'נותרו 2 חדרים בלבד')

// Info
showToast.info('מידע חשוב', 'זמן הצ\'ק-אין: 15:00')
```

**תכונות:**
- ✅ 4 סוגי הודעות
- ✅ אייקונים צבעוניים
- ✅ תיאורים אופציונליים
- ✅ סגירה אוטומטית

---

### 3. AnimatedCard
כרטיס עם אנימציית כניסה

```tsx
import { AnimatedCard } from '@/components/templates/enhanced-ui'

<AnimatedCard delay={0.1}>
  <HotelCard hotel={hotel} />
</AnimatedCard>
```

**Props:**
- `children` - תוכן הכרטיס
- `delay` - השהיה באנימציה (שניות)
- `className` - סגנון נוסף

---

### 4. AnimatedSearchResults
Grid של תוצאות חיפוש עם אנימציות

```tsx
import { AnimatedSearchResults } from '@/components/templates/enhanced-ui'

<AnimatedSearchResults isLoading={booking.isLoading}>
  {hotels.map(hotel => (
    <HotelCard key={hotel.id} hotel={hotel} />
  ))}
</AnimatedSearchResults>
```

**תכונות:**
- ✅ Stagger animations - כל כרטיס נכנס אחרי השני
- ✅ Loading state אוטומטי עם skeletons
- ✅ Responsive grid

---

### 5. AnimatedBookingSteps
Steps indicator מונפש

```tsx
import { AnimatedBookingSteps } from '@/components/templates/enhanced-ui'

const STEPS = [
  { id: 'search', label: 'חיפוש' },
  { id: 'results', label: 'בחירת חדר' },
  { id: 'details', label: 'פרטים' },
  { id: 'payment', label: 'תשלום' },
  { id: 'confirmation', label: 'אישור' },
]

<AnimatedBookingSteps
  steps={STEPS}
  currentStep={booking.step}
/>
```

**תכונות:**
- ✅ צבעים שונים לכל מצב (completed, active, future)
- ✅ אנימציות scale
- ✅ אייקון ✓ לשלבים שהושלמו

---

### 6. EmptyState
מסך ריק מעוצב

```tsx
import { EmptyState } from '@/components/templates/enhanced-ui'

<EmptyState
  title="לא נמצאו חדרים"
  description="נסה לשנות את התאריכים או מספר האורחים"
  action={<Button onClick={handleReset}>נסה שוב</Button>}
  variant="light"
/>
```

---

### 7. ErrorState
מסך שגיאה מקצועי

```tsx
import { ErrorState } from '@/components/templates/enhanced-ui'

<ErrorState
  title="שגיאה בטעינת החדרים"
  description="אירעה שגיאה בחיבור לשרת. אנא נסה שוב."
  onRetry={() => booking.searchHotels(params)}
  variant="dark"
/>
```

---

## דוגמאות שימוש מלאות

### דוגמה 1: טמפלט בסיסי עם כל הקומפוננטות

```tsx
'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { useBookingEngine } from '@/hooks/use-booking-engine'
import {
  EnhancedLoadingOverlay,
  AnimatedBookingSteps,
  AnimatedSearchResults,
  EmptyState,
  ErrorState,
  showToast,
} from '@/components/templates/enhanced-ui'

const STEPS = [
  { id: 'search', label: 'חיפוש' },
  { id: 'results', label: 'תוצאות' },
  { id: 'booking', label: 'הזמנה' },
]

function MyTemplateContent() {
  const booking = useBookingEngine()

  const handleSearch = async (data: any) => {
    try {
      await booking.searchHotels(data)
      showToast.success('נמצאו תוצאות!')
    } catch (error) {
      showToast.error('שגיאה בחיפוש', 'נסה שוב מאוחר יותר')
    }
  }

  return (
    <div>
      <EnhancedLoadingOverlay
        isLoading={booking.isLoading}
        variant="light"
      />

      <AnimatedBookingSteps
        steps={STEPS}
        currentStep={booking.step}
      />

      {booking.error ? (
        <ErrorState
          description={booking.error}
          onRetry={() => booking.retry()}
        />
      ) : booking.searchResults.length === 0 ? (
        <EmptyState
          title="התחל חיפוש"
          description="בחר תאריכים ומספר אורחים"
        />
      ) : (
        <AnimatedSearchResults>
          {booking.searchResults.map((hotel, index) => (
            <AnimatedCard key={hotel.id} delay={index * 0.1}>
              <HotelCard hotel={hotel} />
            </AnimatedCard>
          ))}
        </AnimatedSearchResults>
      )}
    </div>
  )
}

export default function MyTemplate() {
  return (
    <ErrorBoundary>
      <MyTemplateContent />
    </ErrorBoundary>
  )
}
```

---

### דוגמה 2: טמפלט Dark Mode

```tsx
<EnhancedLoadingOverlay
  isLoading={booking.isLoading}
  variant="dark"
/>

<EmptyState
  title="לא נמצאו תוצאות"
  description="נסה לשנות את הפרמטרים"
  variant="dark"
/>

<ErrorState
  description="שגיאת שרת"
  onRetry={handleRetry}
  variant="dark"
/>
```

---

## התקנה

הקומפוננטות דורשות:

```bash
npm install framer-motion sonner
```

כבר מותקן! ✅

---

## עצות לשימוש

1. **תמיד עטפו את הטמפלט ב-ErrorBoundary**
   ```tsx
   export default function Template() {
     return (
       <ErrorBoundary>
         <TemplateContent />
       </ErrorBoundary>
     )
   }
   ```

2. **השתמשו ב-showToast במקום alert()**
   ```tsx
   // ❌ רע
   alert('הזמנה הושלמה')
   
   // ✅ טוב
   showToast.success('הזמנה הושלמה!')
   ```

3. **הוסיפו delay לכרטיסים ברשימה**
   ```tsx
   {hotels.map((hotel, i) => (
     <AnimatedCard key={hotel.id} delay={i * 0.1}>
       <HotelCard hotel={hotel} />
     </AnimatedCard>
   ))}
   ```

4. **השתמשו ב-AnimatedSearchResults לגריד אוטומטי**
   ```tsx
   <AnimatedSearchResults isLoading={loading}>
     {results}
   </AnimatedSearchResults>
   ```

---

## Variants זמינים

כל הקומפוננטות תומכות ב-2 variants:
- `light` (ברירת מחדל) - רקע בהיר
- `dark` - רקע כהה

---

## בעיות נפוצות

**שגיאה: "framer-motion not found"**
```bash
npm install framer-motion
```

**שגיאה: "sonner not found"**
```bash
npm install sonner
```

**אנימציות לא עובדות**
- ודא ש-'use client' בראש הקובץ
- ודא שיש AnimatePresence בעת הצורך

---

**שימוש מהיר** - פשוט העתק את הדוגמה הראשונה והתאם לצרכים שלך! 🚀
