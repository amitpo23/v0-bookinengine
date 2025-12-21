import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Booking Flow
 * Tests the complete user journey from search to booking
 */

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start at home page
    await page.goto('/')
  })

  test('should display hotel search interface', async ({ page }) => {
    // Check for main search elements
    await expect(page.getByText(/find your perfect stay/i)).toBeVisible()
    await expect(page.getByPlaceholder(/where are you going/i)).toBeVisible()
  })

  test('should search for hotels', async ({ page }) => {
    // Fill search form
    await page.getByLabel(/hotel name/i).fill('Grand Hotel')

    // Select dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const checkOutDate = new Date()
    checkOutDate.setDate(checkOutDate.getDate() + 3)

    await page.getByLabel(/check-in/i).fill(tomorrow.toISOString().split('T')[0])
    await page.getByLabel(/check-out/i).fill(checkOutDate.toISOString().split('T')[0])

    // Set guests
    await page.getByLabel(/adults/i).fill('2')

    // Submit search
    await page.getByRole('button', { name: /search/i }).click()

    // Wait for results
    await page.waitForSelector('[data-testid="hotel-results"]', { timeout: 10000 })

    // Check results displayed
    await expect(page.getByTestId('hotel-results')).toBeVisible()
  })

  test('should navigate to booking page from hotel card', async ({ page }) => {
    // Assuming hotels are loaded (you might need to search first)
    await page.getByRole('button', { name: /book now/i }).first().click()

    // Should navigate to booking page
    await expect(page).toHaveURL(/\/booking/)
    await expect(page.getByText(/complete your booking/i)).toBeVisible()
  })

  test('should validate booking form fields', async ({ page }) => {
    // Navigate to booking page (adjust URL as needed)
    await page.goto('/booking?roomId=test')

    // Submit empty form
    await page.getByRole('button', { name: /confirm booking/i }).click()

    // Should show validation errors
    await expect(page.getByText(/first name.*required/i)).toBeVisible()
    await expect(page.getByText(/email.*required/i)).toBeVisible()
  })

  test('should fill booking form successfully', async ({ page }) => {
    // Navigate to booking page
    await page.goto('/booking?roomId=test')

    // Fill guest information
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email/i).fill('john.doe@example.com')
    await page.getByLabel(/phone/i).fill('+1234567890')

    // Check all required fields are filled
    const firstNameValue = await page.getByLabel(/first name/i).inputValue()
    const emailValue = await page.getByLabel(/email/i).inputValue()

    expect(firstNameValue).toBe('John')
    expect(emailValue).toBe('john.doe@example.com')
  })
})

test.describe('AI Chat Interface', () => {
  test('should open AI chat', async ({ page }) => {
    await page.goto('/')

    // Click chat button (adjust selector based on your implementation)
    await page.getByRole('button', { name: /chat/i }).click()

    // Chat interface should be visible
    await expect(page.getByPlaceholder(/ask me anything/i)).toBeVisible()
  })

  test('should send message and receive response', async ({ page }) => {
    await page.goto('/')

    // Open chat
    await page.getByRole('button', { name: /chat/i }).click()

    // Type and send message
    const chatInput = page.getByPlaceholder(/ask me anything/i)
    await chatInput.fill('Hello, I want to book a hotel')
    await chatInput.press('Enter')

    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 })

    // Check response appeared
    const messages = page.getByTestId('ai-message')
    await expect(messages.first()).toBeVisible()
  })
})

test.describe('Multi-language Support', () => {
  test('should switch language', async ({ page }) => {
    await page.goto('/')

    // Click language switcher
    await page.getByRole('button', { name: /language|globe/i }).click()

    // Select Arabic
    await page.getByRole('menuitem', { name: /العربية/i }).click()

    // Wait for page reload
    await page.waitForLoadState('networkidle')

    // Check if Arabic text is visible (adjust selector based on your content)
    // Arabic reads right-to-left, so check dir="rtl"
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('should persist language preference', async ({ page, context }) => {
    await page.goto('/')

    // Switch to Russian
    await page.getByRole('button', { name: /language|globe/i }).click()
    await page.getByRole('menuitem', { name: /русский/i }).click()

    await page.waitForLoadState('networkidle')

    // Create new page in same context
    const newPage = await context.newPage()
    await newPage.goto('/')

    // Should still be in Russian
    const html = newPage.locator('html')
    await expect(html).toHaveAttribute('lang', 'ru')
  })
})

test.describe('Analytics Dashboard', () => {
  test('should display analytics dashboard', async ({ page }) => {
    // Navigate to admin panel (adjust URL based on your auth)
    await page.goto('/admin')

    // Click analytics tab
    await page.getByRole('tab', { name: /analytics/i }).click()

    // Check for key metrics
    await expect(page.getByText(/total bookings/i)).toBeVisible()
    await expect(page.getByText(/total revenue/i)).toBeVisible()
    await expect(page.getByText(/conversion rate/i)).toBeVisible()
  })

  test('should filter analytics by time period', async ({ page }) => {
    await page.goto('/admin')
    await page.getByRole('tab', { name: /analytics/i }).click()

    // Select 7 days filter
    await page.getByRole('button', { name: /7 days/i }).click()

    // Wait for data to reload
    await page.waitForLoadState('networkidle')

    // Check that data updated (you might need to check specific values)
    await expect(page.getByTestId('revenue-chart')).toBeVisible()
  })
})
