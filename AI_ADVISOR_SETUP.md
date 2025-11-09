# AI Advisor Setup Guide - SmolLM3-3B Integration

## 🤖 Overview

FinTrackrX now uses **SmolLM3-3B** from Hugging Face for intelligent financial advice! This small but powerful language model provides personalized recommendations based on your financial data.

## 🚀 Quick Setup

### 1. Get Your Hugging Face Token

1. Go to [https://huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Navigate to **Settings** → **Access Tokens**
4. Click **New Token**
5. Give it a name (e.g., "FinTrackrX")
6. Select **Read** access
7. Copy your token (starts with `hf_...`)

### 2. Add Token to Environment

Add to your `.env.local` file:

```bash
HUGGINGFACE_TOKEN=hf_your_actual_token_here
```

### 3. Test the AI Advisor

1. Start your dev server: `npm run dev`
2. Navigate to **Advisor** page
3. Click on quick prompts or type your own question
4. The AI will respond with personalized advice!

## 💡 Features

### Smart Financial Advice
- **Personalized**: Uses your actual financial data
- **Context-aware**: Knows your income, expenses, and savings rate
- **Actionable**: Provides specific recommendations for Indian households

### Quick Prompts
- 💰 Savings advice
- 📈 Investment tips
- 💳 Budget help
- 📋 Tax planning

### Fallback System
If the AI API is unavailable or slow, the system automatically falls back to rule-based responses to ensure you always get helpful advice!

## 🎯 How It Works

1. **User asks a question** on the Advisor page
2. **System builds context** with your financial data:
   - Monthly income
   - Monthly expenses
   - Current balance
   - Savings rate
   - Transaction count
3. **AI generates response** using SmolLM3-3B model
4. **User receives advice** tailored to their situation

## 📊 Example Questions

### Savings
- "How much should I save every month?"
- "What's a good savings rate for my income?"
- "How to build an emergency fund?"

### Investments
- "What investments should I consider?"
- "Should I invest in mutual funds or stocks?"
- "How to start a SIP?"

### Budgeting
- "How to reduce my expenses?"
- "What percentage should I spend on rent?"
- "How to stick to my budget?"

### Tax Planning
- "How to save tax under 80C?"
- "What are tax-saving investment options?"
- "How much can I save on taxes?"

## 🔧 Technical Details

### Model Information
- **Model**: HuggingFaceTB/SmolLM3-3B
- **Size**: 3 billion parameters
- **Provider**: Hugging Face Inference API
- **Free Tier**: Available with rate limits

### API Configuration
```javascript
{
  max_new_tokens: 150,      // Response length
  temperature: 0.7,         // Creativity (0-1)
  top_p: 0.9,               // Sampling threshold
  do_sample: true,          // Enable sampling
  return_full_text: false   // Only return new text
}
```

### File Structure (Updated)
```
app/api/ai/advisor/route.ts         - Q&A advisor endpoint (Gemini or fallback)
app/api/ai/health/route.ts          - AI financial health scoring + summary (JSON)
app/api/ai/recommendations/route.ts - Structured smart recommendations (JSON)
app/advisor/page.tsx                - Advisor UI (score, recs, action plan, Q&A)
.env.local                          - Environment config
```

### Additional Endpoints

| Endpoint | Method | Purpose | Sample Response |
|----------|--------|---------|-----------------|
| `/api/ai/health` | POST | Generates a 0–100 financial health score + summary | `{ "score": 82, "summary": "You maintain a strong savings rate...", "source": "ai" }` |
| `/api/ai/recommendations` | POST | Returns prioritized actionable recommendations | `{ "items": [{"title":"Boost Savings Rate","desc":"Automate a 20% SIP..."}], "source": "ai" }` |

Both endpoints fall back to heuristic / rule-based logic if the AI key is missing or the model fails.

### Environment Variables (Gemini)
Add these if using Google Gemini instead of Hugging Face:
```bash
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash-latest    # optional override
GEMINI_API_VERSION=v1beta               # optional override
```
If `GEMINI_API_KEY` is absent the system still serves fallback logic so the UI remains functional.

### Health Score Logic
Heuristic components when AI unavailable:
- Base: 50 points
- Savings Rate: +30 (>=30%), +25 (>=20%), +15 (>=10%), +5 (>0)
- Expense Ratio: +20 (<=50%), +10 (<=70%)
- Capped at 100

### Recommendations Fallback Logic
Rule-based suggestions when AI unavailable:
1. Low savings rate → "Boost Savings Rate" with target delta
2. High expense ratio (>70%) → cost control item
3. Otherwise → emergency fund + systematic investing items

### Action Plan
The Advisor page now includes a local Action Plan list you can edit (add / check / remove). Items persist in `localStorage` and are not sent to the AI.

## 🛡️ Privacy & Security

- **Data Privacy**: Your financial data is only sent to the AI during your session
- **No Storage**: Hugging Face doesn't store your conversation data
- **Secure**: All API calls use HTTPS
- **Local Fallback**: If you don't set up Hugging Face token, rule-based advice still works

## 🎨 UI Features

### Minimalist Design
- ✨ Clean gray color scheme
- 🤖 Emoji icons for visual interest
- ⏳ Loading states with animations
- 💬 Clear conversation interface

### Smart Indicators
- **AI Badge**: Shows when Gemini (or model) generated a result
- **Source Tags**: "AI" vs "Fallback" for health score & recommendations
- **Loading Animation**: Spinning robot emoji while thinking
- **Quick Prompts**: One-click question templates
- **Error Handling**: Graceful fallbacks across all endpoints

## 📝 Cost & Limits

### Free Tier (Hugging Face)
- ✅ Free to use
- ⚠️ Rate limited
- ⏱️ May have cold start delays (first request slower)

### Upgrading
If you need higher limits, consider:
- Hugging Face Pro ($9/month)
- Deploy your own model
- Use alternative providers (OpenAI, Anthropic)

## 🔄 Fallback Behavior

The system has smart fallbacks:

1. **Primary**: SmolLM3-3B AI response
2. **Fallback**: Rule-based responses if:
   - API is down
   - Token is missing
   - Rate limit exceeded
   - Response is invalid

This ensures **100% uptime** for financial advice!

## 🐛 Troubleshooting

### AI not responding?
1. Check if `HUGGINGFACE_TOKEN` is set in `.env.local`
2. Verify token is valid (starts with `hf_`)
3. Check browser console for errors
4. Try again (cold start may take 10-20 seconds)

### Getting generic responses?
- The model is warming up (first few requests)
- Try more specific questions
- Include numbers in your questions

### Rate limit errors?
- Wait a few minutes
- Hugging Face free tier has limits
- Consider upgrading or deploying your own

## 🚀 Future Enhancements

Possible improvements:
- [ ] Conversation history
- [ ] Multi-turn conversations
- [ ] Voice input/output
- [ ] PDF report generation
- [ ] Integration with goals tracking
- [ ] Budget recommendations
- [ ] Investment portfolio analysis

## 📚 Resources

- **Hugging Face Docs**: https://huggingface.co/docs/api-inference
- **SmolLM3 Model**: https://huggingface.co/HuggingFaceTB/SmolLM3-3B
- **API Pricing**: https://huggingface.co/pricing

---

**Enjoy your AI-powered financial advisor! 🎉**

Need help? Check the main setup guides or open an issue.
