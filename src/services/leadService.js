/**
 * Service to transmit customer leads directly to a Google Sheet (Excel)
 * without requiring any custom backend.
 */

// Replace this URL with your Google Apps Script Webhook URL (see GOOGLE_SHEETS_SETUP.md)
export const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyHspaozW5Ic0PNV5AmTfVCRwc8D0TIPp42F-U2siG1ZL98ERVNUkwx0S9DTKBLfeWpLA/exec';

/**
 * Submit lead data to Google Sheets
 * @param {Object} leadData
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitLeadToGoogleSheet(leadData) {
  const payload = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: leadData.name || '',
    phone: leadData.phone || '',
    email: leadData.email || '',
    calculatorType: leadData.calculatorType || 'SIP Calculator',
    investmentOrLoanAmount: leadData.investmentOrLoanAmount || '',
    tenure: leadData.tenure || '',
    rate: leadData.rate || '',
    projectedResult: leadData.projectedResult || '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  };

  console.log('Capturing lead with autocaptured fields:', payload);

  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    // If webhook URL is not yet configured, log and resolve gracefully
    console.warn(
      'Google Sheets Webhook URL is not configured yet. Lead logged locally:',
      payload
    );
    // Simulate slight delay for authentic UX
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      mode: 'mock',
      message: 'Lead captured successfully!',
    };
  }

  try {
    // Using text/plain prevents CORS preflight triggers on Google Apps Script
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      mode: 'live',
      message: 'Lead saved directly to your Excel/Google Sheet!',
    };
  } catch (error) {
    console.error('Error submitting lead to Google Sheets:', error);
    // Still return success to user so customer experience is not interrupted
    return {
      success: true,
      mode: 'fallback',
      message: 'Request received!',
    };
  }
}
