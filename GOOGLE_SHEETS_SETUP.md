# 📊 1-Minute Google Sheets (Excel) Lead Capture Setup

Follow these simple steps to connect your website directly to your Google Sheet so all customer leads are saved as rows in real-time without needing any backend server.

---

### Step 1: Create a Google Sheet
1. Go to [sheets.new](https://sheets.new) to create a new blank Google Sheet.
2. Name it **"Mutual Fund Leads"** (or anything you prefer).

---

### Step 2: Add the Google Apps Script
1. In the Google Sheet top menu, click **Extensions** → **Apps Script**.
2. Delete any existing code in `Code.gs` and paste the following snippet:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create styled header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Phone / WhatsApp",
        "Email",
        "Calculator Used",
        "Amount",
        "Tenure",
        "Rate",
        "Projected Result",
        "Page URL"
      ]);
      sheet.getRange(1, 1, 1, 10)
           .setFontWeight("bold")
           .setBackground("#10b981")
           .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // Append customer lead row
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name || "",
      "'" + (data.phone || ""), // prepended apostrophe prevents scientific notation for 10-digit numbers
      data.email || "",
      data.calculatorType || "",
      data.investmentOrLoanAmount || "",
      data.tenure || "",
      data.rate || "",
      data.projectedResult || "",
      data.pageUrl || ""
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Step 3: Deploy as Web App
1. At the top right of Apps Script, click the blue **Deploy** button → **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and choose **Web app**.
3. Fill in:
   - **Description**: `Lead Webhook`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial: allows your website to submit leads without Google login)*
4. Click **Deploy**.
5. Grant permissions if prompted by Google (click *Advanced* → *Go to Untitled project (unsafe)* → *Allow*).
6. Copy the generated **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Paste Your URL into the Project
1. Open `src/services/leadService.js` in your project.
2. Replace:
   ```javascript
   export const GOOGLE_SHEETS_WEBHOOK_URL = '';
   ```
   with your Web app URL:
   ```javascript
   export const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Run `npm run build && git commit -am "feat: connect google sheets webhook" && git push origin master`!

---

### 📥 Downloading Leads to Excel Anytime
You can open this Google Sheet on your phone or laptop anytime, or export it as an Excel file:
- In Google Sheets, click **File** → **Download** → **Microsoft Excel (.xlsx)**.
