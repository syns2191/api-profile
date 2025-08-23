
export function isSeriousInquiry(text: string): boolean {
  const t = text.toLowerCase();
  const keywords = [
    "project","hire","budget","freelance","collaboration","job",
    "quote","proposal","deadline","timeline","pricing","invoice"
  ];
  const hasKeyword = keywords.some(k => t.includes(k));
  const longish = t.split(/\s+/).length >= 12;
  const hasContact = /@|https?:\/\/|(\+?\d[\d\s\-]{7,})/.test(t);
  return hasKeyword || longish || hasContact;
}
