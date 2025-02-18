I'll guide you through filling out each of these LemonSqueezy credentials:

1. **Store ID**:
   - Go to https://app.lemonsqueezy.com/stores
   - Click on your store "sketchflow"
   - Look at the URL, it will be something like: `https://app.lemonsqueezy.com/store/XXXXX`
   - The number at the end is your Store ID

2. **Creating Products and Getting IDs**:
   - Go to https://app.lemonsqueezy.com/products
   - Click "New product"
   
   For Monthly Plan:
   - Name: "Pro Monthly"
   - Price: $2/month
   - Select "Subscription"
   - Billing interval: Monthly
   - After creating, click on the product
   - The URL will be like: `https://app.lemonsqueezy.com/products/XXXXX`
   - This number is your `LEMON_SQUEEZY_PRO_MONTHLY_PRODUCT_ID`
   - Click on "Variants" tab
   - The variant ID will be in the URL: `https://app.lemonsqueezy.com/products/XXXXX/variants/YYYYY`
   - This YYYYY is your `LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID`

   For Yearly Plan:
   - Name: "Pro Yearly"
   - Price: $10/year
   - Select "Subscription"
   - Billing interval: Yearly
   - Follow same steps to get Product ID and Variant ID for yearly plan

3. **Webhook Secret**:
   - Go to https://app.lemonsqueezy.com/settings/webhooks
   - Click "Add webhook"
   - Set the endpoint URL to: `https://sketch-flow.netlify.app/api/payments/lemon/webhook` (based on your NEXTAUTH_URL)
   - Enable these events:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `order_created`
   - After creating, you'll see the signing secret
   - Copy this as your `LEMON_SQUEEZY_WEBHOOK_SECRET`

Your `.env` should end up looking like this (with your actual values):

```env
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_WEBHOOK_SECRET=lswhsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Product and Variant IDs
LEMON_SQUEEZY_PRO_MONTHLY_PRODUCT_ID=12345
LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID=67890
LEMON_SQUEEZY_PRO_YEARLY_PRODUCT_ID=13579
LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID=24680
```

Would you like me to help you test the integration once you have these values? Also, make sure to run the database migration after updating these values:

```bash
npx prisma migrate dev --name add_lemonsqueezy
```
