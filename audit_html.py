import re
with open(r'C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for attendee or capacity or attendee counts
matches = re.findall(r'(\d[\d,]*\s*(?:attendees|capacity|guests|passes|tickets|crowd))', text, re.IGNORECASE)
print('Capacity/attendee matches:', matches)

# Also look for any pricing or rate card
rates = re.findall(r'(?:₦|NGN|Naira)\s*[\d,]+', text, re.IGNORECASE)
print('Rate/pricing matches:', set(rates))
