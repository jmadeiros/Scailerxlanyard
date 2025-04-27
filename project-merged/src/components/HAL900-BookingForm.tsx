"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { GB } from 'country-flag-icons/react/3x2'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BookingFormProps {
  selectedDate: Date
  selectedTime: string
  onClose: () => void
  onSubmit: (formData: BookingFormData) => Promise<void>
}

export interface BookingFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  additionalInfo: string
  marketingConsent: boolean
}

export default function HAL900BookingForm({ selectedDate, selectedTime, onClose }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    additionalInfo: "",
    marketingConsent: false
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    toast.promise(
      (async () => {
        try {
          console.log('Starting booking submission process...');
          
          // Get the Firebase Functions base URL
          const isProduction = process.env.NODE_ENV === 'production';
          const functionsBaseUrl = isProduction 
            ? 'https://europe-west1-scailertest-37078.cloudfunctions.net'
            : 'http://localhost:5001/scailertest-37078/europe-west1';
          
          console.log('Using Firebase Functions base URL:', functionsBaseUrl);
          
          // Create calendar event via Firebase Function
          console.log('Creating calendar event...');
          console.log('Current environment:', process.env.NODE_ENV);
          console.log('Current URL:', window.location.href);
          console.log('API endpoint:', `${functionsBaseUrl}/calendar`);
          
          // First, check if the API endpoint exists by making a HEAD request
          try {
            const checkResponse = await fetch(`${functionsBaseUrl}/calendar`, { 
              method: 'HEAD',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('API endpoint check result:', {
              status: checkResponse.status,
              statusText: checkResponse.statusText,
              headers: Object.fromEntries([...checkResponse.headers.entries()])
            });
          } catch (checkError) {
            console.error('API endpoint check failed:', checkError);
          }
          
          const calendarResponse = await fetch(`${functionsBaseUrl}/calendar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formData,
              selectedDate: selectedDate.toISOString(),
              selectedTime,
            }),
          });

          console.log('Calendar response status:', calendarResponse.status, calendarResponse.statusText);
          console.log('Calendar response headers:', Object.fromEntries([...calendarResponse.headers.entries()]));
          
          // Get the raw response text first
          const rawCalendarResponseText = await calendarResponse.text();
          console.log('Raw calendar response (first 200 chars):', rawCalendarResponseText.substring(0, 200));
          
          // Check if the response is HTML (which would indicate routing to index.html)
          const isCalendarHtmlResponse = rawCalendarResponseText.trim().startsWith('<!DOCTYPE') || 
                                rawCalendarResponseText.trim().startsWith('<html');
          
          if (isCalendarHtmlResponse) {
            console.error('Received HTML response instead of JSON. This indicates the Firebase Function is not available.');
            throw new Error('Calendar Firebase Function is not available. Please check your Firebase Functions deployment.');
          }
          
          let calendarResult;
          try {
            // Try to parse the response as JSON
            calendarResult = rawCalendarResponseText ? JSON.parse(rawCalendarResponseText) : null;
          } catch (parseError) {
            console.error('Failed to parse calendar response as JSON:', parseError);
            console.error('Response was not valid JSON:', rawCalendarResponseText.substring(0, 500));
            throw new Error('Failed to parse calendar service response');
          }

          if (!calendarResponse.ok) {
            console.error('Calendar API error:', calendarResult);
            throw new Error(calendarResult?.error || 'Failed to create calendar event');
          }

          console.log('Calendar event created successfully');

          // Send email notifications via Firebase Function
          const functionUrl = `${functionsBaseUrl}/sendBookingEmails`;
          
          console.log(`Sending email notifications using Firebase Function...`);
          console.log('Email endpoint:', functionUrl);
          
          const emailPayload = {
            formData,
            selectedDate: selectedDate.toISOString(),
            selectedTime,
            calendarLink: calendarResult.htmlLink,
          };
          
          console.log('Email payload:', JSON.stringify({
            formData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone?.substring(0, 3) + "***", // Mask phone for privacy
              hasAdditionalInfo: !!formData.additionalInfo,
              marketingConsent: formData.marketingConsent
            },
            selectedDate: selectedDate.toISOString(),
            selectedTime,
            hasCalendarLink: !!calendarResult.htmlLink
          }));
          
          const emailResponse = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload),
          });

          console.log('Email response status:', emailResponse.status, emailResponse.statusText);
          console.log('Email response headers:', Object.fromEntries([...emailResponse.headers.entries()]));
          
          // Get the raw response text first
          const rawResponseText = await emailResponse.text();
          console.log('Raw email response (first 200 chars):', rawResponseText.substring(0, 200));
          
          // Check if the response is HTML (which would indicate routing to index.html)
          const isHtmlResponse = rawResponseText.trim().startsWith('<!DOCTYPE') || 
                                rawResponseText.trim().startsWith('<html');
          
          if (isHtmlResponse) {
            console.error('Received HTML response instead of JSON. This indicates the Firebase Function is not available.');
            throw new Error('Email Firebase Function is not available. Please check your Firebase Functions deployment.');
          }
          
          let emailResult;
          try {
            // Try to parse the response as JSON
            emailResult = rawResponseText ? JSON.parse(rawResponseText) : null;
            console.log('Parsed email result:', emailResult);
          } catch (parseError) {
            console.error('Failed to parse email response as JSON:', parseError);
            console.error('Response was not valid JSON:', rawResponseText.substring(0, 500));
            throw new Error('Failed to parse email service response');
          }

          if (!emailResponse.ok) {
            console.error('Email API error:', emailResult);
            throw new Error(`Failed to send email notifications: ${emailResult?.error || 'Unknown error'}`);
          }

          console.log('Email notifications sent successfully');

          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            additionalInfo: '',
            marketingConsent: false,
          });
          
          // Close the form after a short delay
          setTimeout(() => {
            onClose();
          }, 2000);
          
          return "success";
        } catch (error) {
          console.error('Submission error:', error);
          throw error instanceof Error ? error.message : 'An unknown error occurred';
        } finally {
          setLoading(false);
        }
      })(),
      {
        loading: "Scheduling your session...",
        success: "Your strategy session has been scheduled. You will receive a confirmation email shortly.",
        error: (err) => `Error: ${err.toString()}`
      }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-scailer-light rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Enter Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm text-white/80">
              First Name <span className="text-scailer-green">*</span>
            </label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className={cn(
                "bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                "focus:ring-1 focus:ring-scailer-green/50"
              )}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm text-white/80">
              Last Name <span className="text-scailer-green">*</span>
            </label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className={cn(
                "bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                "focus:ring-1 focus:ring-scailer-green/50"
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm text-white/80">
              Phone <span className="text-scailer-green">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <GB className="w-4 h-4 rounded-sm" />
                <span className="text-white">+</span>
              </div>
              <Input
                id="phone"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={cn(
                  "pl-16 bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                  "focus:ring-1 focus:ring-scailer-green/50"
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-white/80">
              Email <span className="text-scailer-green">*</span>
            </label>
            <Input
              id="email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={cn(
                "bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                "focus:ring-1 focus:ring-scailer-green/50"
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="additionalInfo" className="text-sm text-white/80">
            Additional Information
          </label>
          <Textarea
            id="additionalInfo"
            placeholder="Is there anything you would like us to know before your appointment?"
            value={formData.additionalInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
            className={cn(
              "min-h-[100px] bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
              "focus:ring-1 focus:ring-scailer-green/50"
            )}
          />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="marketingConsent"
            checked={formData.marketingConsent}
            onCheckedChange={(checked: boolean) => 
              setFormData(prev => ({ ...prev, marketingConsent: checked }))
            }
            className="mt-1"
          />
          <label htmlFor="marketingConsent" className="text-sm text-white/80">
            I confirm that I want to receive content from this company using any contact information I provide.
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={onClose}
            className="bg-transparent border border-scailer-green text-scailer-green hover:bg-scailer-green/10"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "bg-scailer-green text-white",
              "hover:bg-scailer-green/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Session"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
} 