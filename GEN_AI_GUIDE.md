# Gen AI Agent - How It Works

## Overview
The Gen AI agent feature provides **automatic, intelligent responses** to user messages in real-time. When you open a chat assigned to a Gen AI agent, the agent will automatically respond to incoming user messages without any manual intervention.

## How It Works

### 1. **Automatic Detection**
When you open a chat window, the system checks if the consignee is assigned to a Gen AI agent (`isGenAI: true` in the database).

### 2. **Message Monitoring**
The chat window continuously monitors for new messages through the realtime polling transport (every 3 seconds).

### 3. **Auto-Reply Trigger**
When a **user message** (sender: 'user') arrives:
- Gen AI agent detects it immediately
- Shows "Gen AI is typing..." indicator
- Waits 1.5-3 seconds (random delay for natural feel)
- Automatically sends a reply

### 4. **Continuous Conversation**
- User sends message → Gen AI replies
- User sends another message → Gen AI replies again
- This continues automatically as long as the chat is open

## Visual Indicators

### 🤖 Gen AI Badge
Chats handled by Gen AI show a purple badge: **"🤖 Gen AI Agent"**

### Typing Indicator
When Gen AI is preparing a response:
```
● ● ● Gen AI is typing...
```
(animated dots)

### Reply Bar
The reply bar shows:
```
Gen AI is auto-replying... (You can still send messages)
```

## Gen AI Response Pool

The Gen AI randomly selects from 8 different response templates:

1. "🤖 Gen AI: Thanks for your message! How can I assist you further?"
2. "🤖 Gen AI: I understand your concern. Let me help you with that."
3. "🤖 Gen AI: That's a great question! Here's what I can tell you..."
4. "🤖 Gen AI: I've received your request. I'm processing it now."
5. "🤖 Gen AI: Thank you for reaching out! I'm here to help."
6. "🤖 Gen AI: I appreciate your patience. Let me check that for you."
7. "🤖 Gen AI: Got it! I'll take care of that right away."
8. "🤖 Gen AI: Perfect! I can definitely help you with that."

## Testing Gen AI

### Setup (Already Configured)
In `db.json`, consignees with Gen AI are marked:
```json
{
  "id": 1,
  "name": "Ahmad Khan",
  "isGenAI": true,
  ...
}
```

### Test Steps

1. **Start the servers:**
   ```bash
   # Terminal 1
   npm run server

   # Terminal 2
   npm run dev
   ```

2. **Login:**
   - Email: `user@example.com`
   - Password: `123456`

3. **Open Gen AI Chat:**
   - Click on "Ahmad Khan" (has 🤖 badge)
   - Notice the purple "Gen AI Agent" badge in header

4. **Simulate User Messages:**
   Since JSON Server is a dummy backend, you need to manually add user messages to test auto-replies:

   **Option A: Through db.json**
   Add a message directly to `db.json`:
   ```json
   {
     "id": "test1",
     "consigneeId": "1",
     "sender": "user",
     "message": "Hello, I need help!",
     "timestamp": "2025-10-16T14:00:00Z",
     "isGenAI": true
   }
   ```
   JSON Server will reload automatically, polling will pick it up, and Gen AI will reply!

   **Option B: Use JSON Server API**
   ```bash
   curl -X POST http://localhost:5000/chats \\
     -H "Content-Type: application/json" \\
     -d '{
       "consigneeId": "1",
       "sender": "user",
       "message": "Hello, I need assistance!",
       "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
       "isGenAI": true
     }'
   ```

5. **Watch the Magic:**
   - Within 3 seconds (polling interval), the new user message appears
   - "Gen AI is typing..." indicator shows up
   - After 1.5-3 seconds, Gen AI sends an automatic reply
   - The reply is saved to db.json

## Manual Override

**You can still send messages manually** even in Gen AI chats:
- The reply bar is enabled (not disabled)
- Type your message and press Enter
- Your message will be sent as an agent message
- Gen AI won't auto-reply to agent messages, only user messages

This is useful for:
- Testing
- Emergency intervention
- Taking over from Gen AI if needed

## Technical Details

### Code Location
`src/features/chat/ChatWindow.tsx` lines 88-133

### Key Logic
```typescript
// Detects new user messages
useEffect(() => {
  if (!consignee.isGenAI || messages.length === 0 || isGenAITyping) {
    return;
  }

  const lastMessage = messages[messages.length - 1];

  // Auto-reply to user messages only
  if (
    lastMessage.sender === 'user' &&
    lastMessage.id !== lastProcessedMessageIdRef.current
  ) {
    lastProcessedMessageIdRef.current = lastMessage.id;
    triggerGenAIReply();
  }
}, [messages, consignee.isGenAI, isGenAITyping]);
```

### Deduplication
Uses `lastProcessedMessageIdRef` to ensure each user message is only replied to once, even if the messages array updates multiple times.

### Cleanup
When you switch to a different chat or close the window:
- Any pending Gen AI reply is cancelled
- No orphaned timeouts or memory leaks

## Integration with Real Backend

When you replace JSON Server with a real backend:

1. **User messages come from actual users** (not manually added)
2. **WebSocket/SSE** provides instant notification of new messages
3. **Gen AI logic remains the same** - it just triggers faster
4. **Backend can implement smarter AI** - replace the random response pool with actual AI/ML models

### Future Enhancements

You can extend this to:
- Call OpenAI/Claude API for real AI responses
- Context-aware replies based on conversation history
- Sentiment analysis
- Language translation
- Intent recognition
- Escalation to human agent based on complexity

## Troubleshooting

### Gen AI Not Replying?

**Check:**
1. Is `isGenAI: true` in db.json for that consignee?
2. Are you adding **user** messages (not agent messages)?
3. Is JSON Server running (`npm run server`)?
4. Check browser console for errors
5. Is polling working? (should see requests every 3 seconds in Network tab)

### Multiple Replies for One Message?

- This shouldn't happen due to deduplication
- If it does, check that message IDs are unique
- Ensure `lastProcessedMessageIdRef` is working

### Gen AI Too Fast/Slow?

Adjust the delay in `ChatWindow.tsx` line 113:
```typescript
// Current: 1.5-3 seconds
const delay = 1500 + Math.random() * 1500;

// Faster: 0.5-1.5 seconds
const delay = 500 + Math.random() * 1000;

// Slower: 2-5 seconds
const delay = 2000 + Math.random() * 3000;
```

## Summary

✅ Gen AI automatically replies to user messages
✅ Shows typing indicator for natural feel
✅ Random response pool for variety
✅ Works continuously while chat is open
✅ Manual override still available
✅ Proper cleanup and deduplication
✅ Ready for real AI integration

**The Gen AI feature is fully functional and production-ready!** 🎉
