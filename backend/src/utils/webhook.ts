export const sendWebhookNotification = async (message: string) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message, text: message }) // 'content' for Discord, 'text' for Slack
    });
  } catch (error) {
    console.error('Webhook notification failed:', error);
  }
};
