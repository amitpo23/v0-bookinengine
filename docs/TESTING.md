# Testing Suite Documentation 🧪

Comprehensive testing setup with Jest (unit tests) and Playwright (E2E tests) for the booking engine.

## Overview

This project includes a complete testing suite:
- **Jest** - Unit and integration tests for services and components
- **Playwright** - End-to-end tests for user flows
- **React Testing Library** - Component testing
- **Coverage Reports** - Track code coverage

## Quick Start

### Install Playwright Browsers

```bash
npm run playwright:install
```

### Run Unit Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Run E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Watch tests run in browser
npm run test:e2e:headed
```

## Test Structure

```
v0-bookinengine/
├── __tests__/           # Unit & Integration tests
│   └── unit/
│       ├── analytics.test.ts
│       ├── ab-testing.test.ts
│       └── ...
├── e2e/                 # End-to-end tests
│   ├── booking-flow.spec.ts
│   ├── ai-chat.spec.ts
│   └── ...
├── jest.config.js       # Jest configuration
├── jest.setup.js        # Jest setup file
└── playwright.config.ts # Playwright configuration
```

## Unit Tests (Jest)

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Place in `__tests__/unit/` directory
- Mirror source file structure

### Example: Testing Analytics Service

```typescript
// __tests__/unit/analytics.test.ts
import { AnalyticsService } from '@/lib/analytics/analytics-service'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    auditLog: {
      count: jest.fn(),
    },
  },
}))

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(() => {
    service = new AnalyticsService()
    jest.clearAllMocks()
  })

  it('should calculate conversion rate correctly', async () => {
    const { prisma } = require('@/lib/db')

    // Mock data
    prisma.booking.findMany.mockResolvedValue([
      { status: 'CONFIRMED', totalPrice: 100 },
      { status: 'CONFIRMED', totalPrice: 200 },
    ])
    prisma.auditLog.count.mockResolvedValue(10) // 10 searches

    const stats = await service.getBookingStats({ days: 30 })

    expect(stats.conversions).toBe(2)
    expect(stats.conversionRate).toBe(20) // 2/10 * 100
  })
})
```

### Example: Testing A/B Testing Service

```typescript
// __tests__/unit/ab-testing.test.ts
import { ExperimentService } from '@/lib/ab-testing/experiment-service'

describe('ExperimentService', () => {
  it('should reject invalid variant weights', async () => {
    const service = new ExperimentService()

    const result = await service.createExperiment({
      name: 'Test',
      description: 'Test experiment',
      variants: [
        { name: 'A', systemPrompt: 'Prompt A', weight: 40 },
        { name: 'B', systemPrompt: 'Prompt B', weight: 50 },
        // Total = 90, not 100!
      ]
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('must sum to 100')
  })

  it('should assign variant by weight', async () => {
    // Test weighted random selection
    const service = new ExperimentService()
    // ... test implementation
  })
})
```

### Example: Testing React Components

```typescript
// __tests__/unit/language-switcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LanguageProvider } from '@/lib/i18n/language-context'

describe('LanguageSwitcher', () => {
  it('should render all language options', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    )

    // Click to open dropdown
    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Check all languages are visible
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('עברית')).toBeInTheDocument()
    expect(screen.getByText('العربية')).toBeInTheDocument()
    expect(screen.getByText('Русский')).toBeInTheDocument()
  })

  it('should switch language on selection', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    )

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('العربية'))

    // Check localStorage was updated
    expect(localStorage.getItem('locale')).toBe('ar')
  })
})
```

## E2E Tests (Playwright)

### Test File Naming

- E2E tests: `*.spec.ts`
- Place in `e2e/` directory
- Group by feature/flow

### Example: Booking Flow Test

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test('should complete full booking journey', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/')

    // 2. Fill search form
    await page.getByLabel(/hotel name/i).fill('Grand Hotel')
    await page.getByLabel(/check-in/i).fill('2024-12-25')
    await page.getByLabel(/check-out/i).fill('2024-12-28')
    await page.getByLabel(/adults/i).fill('2')

    // 3. Submit search
    await page.getByRole('button', { name: /search/i }).click()

    // 4. Wait for results
    await page.waitForSelector('[data-testid="hotel-results"]')

    // 5. Click first hotel
    await page.getByRole('button', { name: /book now/i }).first().click()

    // 6. Fill booking form
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/phone/i).fill('+1234567890')

    // 7. Submit booking
    await page.getByRole('button', { name: /confirm/i }).click()

    // 8. Verify confirmation
    await expect(page.getByText(/booking confirmed/i)).toBeVisible()
  })
})
```

### Example: AI Chat Test

```typescript
// e2e/ai-chat.spec.ts
import { test, expect } from '@playwright/test'

test.describe('AI Chat', () => {
  test('should respond to user messages', async ({ page }) => {
    await page.goto('/')

    // Open chat
    await page.getByRole('button', { name: /chat/i }).click()

    // Type message
    const input = page.getByPlaceholder(/ask me anything/i)
    await input.fill('I want to book a hotel in Tel Aviv')
    await input.press('Enter')

    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-message"]', {
      timeout: 10000
    })

    // Verify response appeared
    const response = page.getByTestId('ai-message').first()
    await expect(response).toBeVisible()
  })

  test('should support multi-language', async ({ page }) => {
    await page.goto('/')

    // Switch to Arabic
    await page.getByRole('button', { name: /language/i }).click()
    await page.getByRole('menuitem', { name: /العربية/i }).click()

    // Check RTL applied
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })
})
```

### Example: Analytics Dashboard Test

```typescript
// e2e/analytics.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Analytics Dashboard', () => {
  test('should display key metrics', async ({ page }) => {
    await page.goto('/admin')

    // Navigate to analytics
    await page.getByRole('tab', { name: /analytics/i }).click()

    // Check metrics are visible
    await expect(page.getByText(/total bookings/i)).toBeVisible()
    await expect(page.getByText(/total revenue/i)).toBeVisible()
    await expect(page.getByText(/conversion rate/i)).toBeVisible()

    // Check charts are rendered
    await expect(page.getByTestId('revenue-chart')).toBeVisible()
    await expect(page.getByTestId('conversion-chart')).toBeVisible()
  })

  test('should filter by time period', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('tab', { name: /analytics/i }).click()

    // Select 7 days
    await page.getByRole('button', { name: /7 days/i }).click()

    // Wait for data reload
    await page.waitForLoadState('networkidle')

    // Verify filter applied (check URL or data)
    await expect(page.url()).toContain('days=7')
  })
})
```

## Configuration

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Coverage Reports

Generate coverage reports:

```bash
npm run test:coverage
```

View coverage:
```
open coverage/lcov-report/index.html
```

Coverage thresholds can be set in `jest.config.js`:

```javascript
coverageThresholds: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

## Best Practices

### 1. Test Naming

**Good:**
```typescript
it('should calculate conversion rate correctly')
it('should reject invalid email addresses')
it('should display error when booking fails')
```

**Bad:**
```typescript
it('test conversion rate')
it('check email')
it('error test')
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should add item to cart', () => {
  // Arrange
  const cart = new Cart()
  const item = { id: 1, name: 'Hotel Room', price: 100 }

  // Act
  cart.addItem(item)

  // Assert
  expect(cart.items).toHaveLength(1)
  expect(cart.total).toBe(100)
})
```

### 3. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/lib/api/medici', () => ({
  searchHotels: jest.fn().mockResolvedValue([...mockHotels]),
}))

// Mock database
jest.mock('@/lib/db', () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))
```

### 4. Test Data Builders

```typescript
// test-utils/builders.ts
export function buildBooking(overrides = {}) {
  return {
    id: 'bk-123',
    hotelName: 'Test Hotel',
    totalPrice: 100,
    status: 'CONFIRMED',
    ...overrides,
  }
}

// In tests
const booking = buildBooking({ totalPrice: 200 })
```

### 5. Page Objects (Playwright)

```typescript
// e2e/pages/booking-page.ts
export class BookingPage {
  constructor(private page: Page) {}

  async fillGuestInfo(data: { firstName, lastName, email, phone }) {
    await this.page.getByLabel(/first name/i).fill(data.firstName)
    await this.page.getByLabel(/last name/i).fill(data.lastName)
    await this.page.getByLabel(/email/i).fill(data.email)
    await this.page.getByLabel(/phone/i).fill(data.phone)
  }

  async submitBooking() {
    await this.page.getByRole('button', { name: /confirm/i }).click()
  }
}

// In tests
const bookingPage = new BookingPage(page)
await bookingPage.fillGuestInfo({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
})
await bookingPage.submitBooking()
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

### Vercel

Add to `vercel.json`:

```json
{
  "buildCommand": "npm run build && npm test",
  "framework": "nextjs"
}
```

## Debugging

### Debug Jest Tests

```bash
# Run specific test file
npm test analytics.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="conversion rate"

# Debug in VS Code
# Add breakpoint, then F5 to debug
```

### Debug Playwright Tests

```bash
# Run with UI mode (interactive debugging)
npm run test:e2e:ui

# Run with headed browser
npm run test:e2e:headed

# Generate trace on failure
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Common Issues

### Jest: Module not found

**Problem:** Can't resolve `@/` imports

**Solution:** Check `moduleNameMapper` in `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Playwright: Timeout

**Problem:** Test times out waiting for element

**Solutions:**
- Increase timeout: `{ timeout: 30000 }`
- Wait for network: `await page.waitForLoadState('networkidle')`
- Check selector: Use `getByRole`, `getByLabel` instead of CSS selectors

### Flaky Tests

**Problem:** Tests pass/fail inconsistently

**Solutions:**
- Avoid hard-coded waits: `await page.waitFor(5000)` ❌
- Use explicit waits: `await expect(element).toBeVisible()` ✅
- Mock time: `jest.useFakeTimers()`
- Isolate tests: Don't share state between tests

## What to Test

### ✅ Do Test

- Business logic (analytics calculations, A/B testing)
- API endpoints (request/response)
- User flows (booking, search, chat)
- Edge cases (empty states, errors)
- Accessibility (keyboard navigation, screen readers)

### ❌ Don't Test

- Third-party libraries (trust they're tested)
- Implementation details (internal state)
- Styles and CSS (use visual regression testing instead)

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

1. ✅ **Write First Tests** - Start with critical paths
2. 📊 **Check Coverage** - Aim for >70% coverage
3. 🤖 **Add to CI** - Run tests on every commit
4. 🐛 **Fix Flaky Tests** - Ensure reliability
5. 📈 **Expand Coverage** - Add more edge cases

---

**Questions?** Check existing tests in `__tests__/` and `e2e/` for examples!
