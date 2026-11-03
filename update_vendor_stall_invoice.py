import os

file_path = r"C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\src\sections\VendorReg.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update WhatsApp URL
old_msg = "• Selected Tier: ${selectedBooth.label} (${selectedBooth.size})\\n"
new_msg = "• Selected Tier: ${selectedBooth.label} (${selectedBooth.size})\\n• Allocated Spot: Stall [${form.selectedStall || 'P-04'}] (Freedom Park, CMS)\\n"

if old_msg in content:
    content = content.replace(old_msg, new_msg)
    print("WhatsApp message updated with stall ID!")

# 2. Update Invoice text
old_inv = "`BOOTH TIER      : ${selectedBooth.label} (${selectedBooth.size})`,"
new_inv = """`BOOTH TIER      : ${selectedBooth.label} (${selectedBooth.size})`,
      `ALLOCATED STALL : STALL [${form.selectedStall || 'P-04'}] (Freedom Park, CMS)`, """

if old_inv in content:
    content = content.replace(old_inv, new_inv)
    print("Invoice text updated with allocated stall!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
