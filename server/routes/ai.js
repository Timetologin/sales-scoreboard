const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/ai/chat
// @desc    Send message to AI assistant
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // System prompt for sales assistant
    const systemPrompt = `You are a helpful sales assistant for a company's sales scoreboard application. 
You help employees with sales tips, motivation, and answer questions about improving their performance. 
Keep responses concise, encouraging, and actionable. Focus on sales strategies, customer relationships, 
and productivity tips.`;

    let aiResponse = '';

    // Try Claude API first (if available)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [
              {
                role: 'user',
                content: `${systemPrompt}\n\nUser question: ${message}`
              }
            ]
          },
          {
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          }
        );

        aiResponse = response.data.content[0].text;
      } catch (error) {
        console.error('Claude API error:', error.response?.data || error.message);
        // Fall through to try OpenAI or fallback
      }
    }

    // Try OpenAI API if Claude failed or not configured
    if (!aiResponse && process.env.OPENAI_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        aiResponse = response.data.choices[0].message.content;
      } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        // Fall through to fallback
      }
    }

    // Fallback responses if no API is configured
    if (!aiResponse) {
      const fallbackResponses = {
        'how to improve sales': 'Here are some proven strategies to boost your sales:\n\n1. **Build Strong Relationships** - Focus on understanding customer needs rather than just pushing products.\n2. **Follow Up Consistently** - Many sales are made on the 5th-12th contact. Persistence pays off!\n3. **Active Listening** - Let customers talk 70% of the time. Listen to their pain points.\n4. **Value Proposition** - Clearly articulate how your product solves their specific problems.\n5. **Set Daily Goals** - Break big targets into manageable daily activities.\n\nRemember: Every "no" brings you closer to a "yes"! Keep going! 💪',
        
        'motivation': 'You\'re doing great! Remember:\n\n✨ **Success is built daily** - Small consistent efforts compound into extraordinary results.\n🎯 **Focus on progress, not perfection** - Every sale matters, no matter how small.\n💪 **Rejection builds resilience** - Top performers hear "no" more often than anyone else.\n🌟 **Your attitude determines altitude** - Stay positive and watch your results soar!\n\nYou\'ve got this! The leaderboard is just a snapshot of this moment. Your next big win is right around the corner! 🚀',
        
        'tips': 'Quick Sales Tips for Today:\n\n🎯 **Start with your warmest leads** - Build momentum early\n📞 **Make those calls before 10 AM** - Catch people fresh and receptive\n📧 **Personalize every message** - Generic outreach gets ignored\n🤝 **Ask for referrals** - Your happy customers are your best salespeople\n📊 **Track everything** - You can\'t improve what you don\'t measure\n\nPick one tip and master it today! 🌟',
        
        'default': 'I\'m here to help you succeed! Here are some things I can help with:\n\n💡 **Sales Strategies** - Ask "how to improve sales"\n🎯 **Motivation** - Type "motivate me" when you need a boost\n📈 **Quick Tips** - Ask for "sales tips" for daily actionable advice\n🤝 **Customer Relations** - Get advice on building lasting relationships\n📊 **Performance** - Learn how to track and improve your metrics\n\nWhat would you like to know? 😊'
      };

      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('improve') || messageLower.includes('better') || messageLower.includes('increase')) {
        aiResponse = fallbackResponses['how to improve sales'];
      } else if (messageLower.includes('motivat') || messageLower.includes('inspire') || messageLower.includes('encourage')) {
        aiResponse = fallbackResponses['motivation'];
      } else if (messageLower.includes('tip') || messageLower.includes('advice') || messageLower.includes('help')) {
        aiResponse = fallbackResponses['tips'];
      } else {
        aiResponse = fallbackResponses['default'];
      }
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      message: 'Server error processing AI request',
      response: 'I\'m having trouble connecting right now. Please try again in a moment! In the meantime, remember: consistency is key in sales. Keep pushing forward! 💪'
    });
  }
});

module.exports = router;
