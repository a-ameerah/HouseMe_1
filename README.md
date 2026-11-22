# HouseMe: Know Before You Go

HouseMe is a mobile-first Nigerian house-hunting application built as a polished, clickable prototype for a Software Innovation class demo.

**Core idea:** A short-video feed is the hook, but the real product is a trusted house record. Every fact says who provided it (Verified uploader, Authority checked, Resident-reported, Platform-checked), and any unknown fact is shown as "Not provided", never as a positive.

---

## 1. Quick Start and Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation and Development Server
```bash
# Install dependencies
npm install

# Run unit tests (Vitest)
npm test

# Build production bundle with strict TypeScript verification
npm run build

# Start local preview server
npm run preview
```

Open your browser at `http://localhost:4173/` (or `http://localhost:5173/` during `npm run dev`).

On desktop screens, HouseMe automatically presents the app inside a centered 430px mobile frame over a soft green gradient background. The Agent Dashboard and Admin consoles use a responsive wide layout.

---

## 2. Interactive Role Switcher

You can switch roles at any point using the floating demo pill in the top-right corner or through the **Profile** tab:
1. **Hunter (Ada):** 24-year-old mainland tenant searching for 1 to 2 bed flats with budget ₦800,000 to ₦1,800,000.
2. **Agent (Mr Tunde Adebayo):** Licensed mainland leasing specialist with 18 of 20 matched viewings and 12-minute average response time.
3. **Admin (HouseMe Operations):** Operations lead reviewing agent KYC applications, managing escrow disputes, and tracking platform unit economics.

To restore seed data to its initial state at any time, click the circular reset icon on the role switcher pill.

---

## 3. Demo Walkthrough Script

Follow these steps for the live demonstration:

1. **Discover Feed:**
   - Open as Ada (Hunter).
   - Scroll through vertical video-style cards.
   - Tap the screen to pause or play the Ken Burns scene walkthrough.
   - Toggle **Data Saver** in the top bar to show poster-first mode.
   - Note the overlay showing price chip, bedrooms, verified trust chips, and freshness tags.
   - Press **Why you see this** to view the explainable ranking breakdown.

2. **House Details & MatchBar:**
   - Tap **Full details** on the "Spacious 2 Bedroom Flat in Sabo" house.
   - Review the **MatchBar**: "Meets 2 of 3, 1 unknown" against Ada's dealbreakers.
   - Tap the MatchBar to expand the itemized breakdown (Steady power: met, No flooding: met, Tarred road: unknown).
   - Switch to the **Costs** tab: review the calculated Move-in Cost (₦1,564,000) and note the "Not provided" line for Service Charge with the "Ask agent" action.
   - Switch to **Location**: observe the approximate-area map circle and the notice stating exact addresses remain private until booking.

3. **Reviews & Community Q&A:**
   - Open the **Reviews** tab.
   - Check the 12-month summary consensus for power and water.
   - Note the amber "Outdated, over 12 months" tag on older reviews.
   - Observe the indented response from Mr Tunde Adebayo.
   - Tap **Write Review** to inspect the quick rating chips and verified review constraints.

4. **Agent Profile:**
   - Tap Mr Tunde Adebayo's profile strip.
   - See his verified accuracy score ("Matched in 18 of 20"), 12-minute response time, and portfolio.
   - Notice the "You were viewing" card pinned at the top.

5. **Signature Booking & Escrow Flow:**
   - Return to the house page and tap **Book Viewing**.
   - Step 1 (Slot): Choose an inspection slot.
   - Step 2 (Fee): Review the ₦4,000 escrow fee (₦3,400 agent payout, ₦600 platform cut). Tap "Share viewing details with a trusted contact" to preview WhatsApp safety sharing.
   - Step 3 (Payment): Select simulated payment method (Card, Transfer, or USSD) and authorize payment.
   - Step 4 (Confirmed): Receive your 4-digit arrival code and see the private street address unlocked.

6. **Agent Role & Arrival Code Verification:**
   - Switch to the **Agent** role via the floating demo pill.
   - Navigate to the Agent Dashboard.
   - Locate the booking in "Enquiries & Codes".
   - Enter the 4-digit arrival code provided by Ada and click "Verify Code".
   - View the Escrow Wallet card update to show funds in "Pending release".

7. **Hunter Post-Viewing Survey & Fast-Forward:**
   - Switch back to the **Hunter** role and navigate to the **Viewings** tab.
   - Notice the viewing state is now "Viewing Done, 24h Window Active".
   - Tap **Complete 20-second Viewing Survey**: select "Partly matched", select "Power differed", and confirm HouseMe helped avoid other viewings.
   - Tap the **Fast-forward 24 hours** demo button.
   - Notice the payment is released to the agent and the avoided viewings counter increments.

8. **Admin Operations & Agent Verification:**
   - Switch to the **Admin** role.
   - In "Agent Applications", find the pending application for **Mr Chidi Eze**.
   - Review automated KYC checks (Phone verified, ID match, Selfie match, Mandate uploaded).
   - Click **Approve Agent**.
   - Navigate to the **Audit Log** tab to verify the action was recorded with an immutable timestamp.

9. **Revenue Model:**
   - Open the **Revenue Model** tab in the Admin console.
   - Toggle the monthly viewing sensitivity slider between 2,000 viewings (Base Case) and 1,000 viewings (Conservative).
   - Review the financial assumptions (₦600 viewing cut, ₦10,000 Pro tiers, ₦2,000 boosts, 2% processing deduction).
   - Switch to **How HouseMe Makes Money** in the profile to see the public explanation.

---

## 4. What is Simulated

This prototype operates entirely in the browser using React state and `localStorage` persistence:
- **Payments:** All debit card, bank transfer, and USSD flows are simulated. No real money is charged.
- **SMS and OTP:** Authentication uses simulated 6-digit codes (default: `123456`).
- **Identity and Authority Verification:** Document uploads, NIN matches, and biometric selfies are simulated for demonstration purposes.
- **Video Playback:** Property scenes use procedurally generated SVG vector art with Ken Burns motion. If an MP4 video is placed in `/public/videos/{houseId}.mp4`, the player can load it directly.
- **Maps:** Maps are stylized vector approximations with a ~300m privacy circle rather than an exact pin.
- **24-Hour Timer:** A "Fast-forward 24 hours" control simulates the passage of the inspection dispute window.
- **Pilot City:** Lagos is used as the pilot market.
- **Regulatory Note:** Revenue figures and fee structures are educational assumptions. The legality and licensing requirements of viewing fees in Lagos must be evaluated with a Nigerian legal practitioner and LASRERA before any commercial deployment.
