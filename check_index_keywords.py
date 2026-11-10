with open(r'C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

keywords = ['Freedom Park', '2,000', '10,000,000', 'Providus', 'stall', 'Stall']
for kw in keywords:
    print(f'Count of "{kw}": {text.count(kw)}')
