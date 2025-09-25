// Simple inappropriate content filter
export function containsInappropriateContent(text: string): boolean {
  const bannedWords = [
    "abuse", "hate", "spam", "offensive", "inappropriate", "xxx", "badword1", "badword2"
    // Add more banned words/phrases as needed
  ];
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
}
