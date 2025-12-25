'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  CheckCircle2,
  XCircle,
  Send,
  AlertCircle,
  Settings,
  Loader2,
} from 'lucide-react';

interface EmailStatus {
  enabled: boolean;
  provider: string;
  configured: boolean;
  fromEmail: string;
  fromName: string;
}

export function EmailSettings() {
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Load email status
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/admin/email');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to load email status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setTestResult({
        success: false,
        message: 'Please enter an email address',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          testEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult({
          success: true,
          message: `Test email sent successfully to ${testEmail}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to send test email',
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Failed to send test email',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Status
          </CardTitle>
          <CardDescription>
            אימיילים נשלחים אוטומטית לאחר כל הזמנה מוצלחת
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Service Status</p>
              <p className="text-sm text-muted-foreground">
                {status?.enabled ? 'Active and sending emails' : 'Disabled - not configured'}
              </p>
            </div>
            <Badge variant={status?.enabled ? 'default' : 'secondary'} className="gap-1">
              {status?.enabled ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Enabled
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Disabled
                </>
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider</p>
              <p className="text-sm">{status?.provider || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Key</p>
              <p className="text-sm">
                {status?.configured ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-3 w-3" />
                    Missing
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">From Email</p>
              <p className="text-sm">{status?.fromEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">From Name</p>
              <p className="text-sm">{status?.fromName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Alert */}
      {!status?.enabled && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Email service not configured.</strong> To enable automatic booking
            confirmations, add <code className="text-xs">RESEND_API_KEY</code> to your environment
            variables.
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Get API key from Resend →
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Email Card */}
      {status?.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Email Service
            </CardTitle>
            <CardDescription>שלח אימייל בדיקה כדי לוודא שהכל עובד</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your.email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <Button onClick={handleTestEmail} disabled={testing || !testEmail}>
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>

            {testResult && (
              <Alert
                className={
                  testResult.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }
              >
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={testResult.success ? 'text-green-800' : 'text-red-800'}
                >
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">1. Get Resend API Key:</p>
            <p className="text-muted-foreground pl-4">
              • Visit{' '}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                resend.com/api-keys
              </a>
              <br />
              • Create a new API key
              <br />• Copy the key (starts with &quot;re_&quot;)
            </p>

            <p className="font-semibold pt-4">2. Add to Environment Variables:</p>
            <div className="pl-4 bg-muted p-3 rounded-md font-mono text-xs">
              RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              <br />
              FROM_EMAIL=bookings@yourdomain.com
              <br />
              FROM_NAME=Your Hotel Name
            </div>

            <p className="font-semibold pt-4">3. Verify Domain:</p>
            <p className="text-muted-foreground pl-4">
              • Add DNS records (SPF, DKIM, DMARC)
              <br />
              • Wait for verification (up to 48 hours)
              <br />• Check status in Resend dashboard
            </p>

            <p className="font-semibold pt-4">4. Restart Application:</p>
            <p className="text-muted-foreground pl-4">
              • Redeploy on Vercel or restart your server
              <br />• Test email service using the form above
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Booking Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  Sent automatically after successful booking with all details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Cancellation Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  Sent when a booking is cancelled
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg opacity-50">
              <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold">Check-in Reminder (Coming Soon)</p>
                <p className="text-sm text-muted-foreground">
                  Automatic reminder 24 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
