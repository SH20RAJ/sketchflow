# SketchFlow

SketchFlow is a powerful and intuitive collaborative whiteboard platform designed to bring ideas to life. It provides a seamless environment for brainstorming, visual collaboration, and recording creative processes. With features like real-time collaboration, customizable templates, AI assistance, and exporting options, SketchFlow empowers individuals and teams to transform ideas into actionable plans.

## Features

### Core Features
- **Collaborative Whiteboard:** Real-time drawing, writing, and brainstorming with team members.
- **Pre-Built Templates:** A collection of templates to kickstart your projects.
- **Recording and Exporting:** Record your whiteboard sessions and export them in formats like PNG, PDF, or MP4.
- **AI Assistance:** Get suggestions for summarizing content, generating ideas, or creating visuals.

### Advanced Features
- **Slack, Notion, and Trello Integrations:** Connect your whiteboard with productivity tools.
- **Offline Mode:** Work offline and sync when back online.
- **Subscription Plans:** Premium features with flexible subscription options.

## Payment Integration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the Razorpay Dashboard
3. Add the following environment variables to your `.env` file:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
4. Add the Razorpay script to your HTML:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

### Cashfree Payment Integration
1. Create a Cashfree account at [cashfree.com](https://www.cashfree.com)
2. Get your App ID and Secret Key from the Cashfree Dashboard
3. Add the following environment variables to your `.env` file:
   ```env
   CASHFREE_APP_ID=your_app_id
   CASHFREE_SECRET_KEY=your_secret_key
   CASHFREE_API_VERSION=2022-09-01
   CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg  # Use https://api.cashfree.com/pg for production

   # Subscription Plans
   PRO_MONTHLY_PLAN_AMOUNT=999
   PRO_YEARLY_PLAN_AMOUNT=9999
   ```
4. Add the Cashfree script to your HTML:
   ```html
   <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
   ```

### Testing Payments
- Use Razorpay's test card numbers for development:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
- Use Cashfree's test card numbers for development:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - OTP: 123456
- **Version Control:** Keep track of changes and revert to previous versions as needed.

## Tech Stack
- **Frontend:** React.js/Next.js, TailwindCSS
- **Backend:** Node.js, WebSocket (for real-time collaboration)
- **Database:** MongoDB or Firebase
- **AI Tools:** OpenAI API for AI assistance
- **Hosting:** Vercel (frontend), AWS/DigitalOcean (backend)

## Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- MongoDB (if not using Firebase)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sketchflow.git
   cd sketchflow
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open the app in your browser at `http://localhost:3000`.

## Usage
- Sign up or log in using your email or third-party services (Google, Microsoft).
- Start a new whiteboard or choose a template.
- Invite team members to collaborate in real-time.
- Use AI features for suggestions and enhancements.
- Save, record, and export your work.

## Contributing
We welcome contributions from the community! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork:
   ```bash
   git push origin feature-name
   ```
4. Open a pull request with a detailed description of your changes.

## Roadmap
For a detailed roadmap and future development plans, check out our [Plans](plans.md) document.

Key highlights of upcoming features:
- Add more AI-powered tools for text/image suggestions.
- Improve UI/UX with feedback from early users.
- Expand template library.
- Implement offline mode and enhanced exporting options.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For support or inquiries, reach out to:
- **Email:** sh20raj@gmail.com
- **GitHub:** [@sh20raj](https://github.com/sh20raj)

---

Start collaborating and bring your ideas to life with SketchFlow!