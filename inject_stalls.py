import os

file_path = r"C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\src\sections\VendorReg.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """const MAP_ZONES = [
  { id: 'collab', label: 'MONUMENT TAKEOVER', hint: '64 sqm Activation Footprint' },
  { id: 'premium', label: 'DOUBLE PERGOLA CORNERS', hint: '16 sqm 270° Crossways' },
  { id: 'double', label: 'GRAIL CELL VAULTS (BLOCK A)', hint: 'Walled Colonial Brick Cells' },
  { id: 'standard', label: 'BRICK PERGOLA BAYS (WING B)', hint: '9 sqm Covered Brick Arch' },
]"""

replacement = """const MAP_ZONES = [
  { id: 'collab', label: 'MONUMENT TAKEOVER', hint: '64 sqm Activation Footprint' },
  { id: 'premium', label: 'DOUBLE PERGOLA CORNERS', hint: '16 sqm 270° Crossways' },
  { id: 'double', label: 'GRAIL CELL VAULTS (BLOCK A)', hint: 'Walled Colonial Brick Cells' },
  { id: 'standard', label: 'BRICK PERGOLA BAYS (WING B)', hint: '9 sqm Covered Brick Arch' },
]

export const FREEDOM_PARK_STALLS = [
  // Brick Pergola Bays (standard - 3x3m)
  { id: 'P-01', tier: 'standard', zone: 'Pergola West', label: 'Arch Bay P-01', size: '3×3m', status: 'taken', reservedBy: 'Sole Lagos' },
  { id: 'P-02', tier: 'standard', zone: 'Pergola West', label: 'Arch Bay P-02', size: '3×3m', status: 'available' },
  { id: 'P-03', tier: 'standard', zone: 'Pergola West', label: 'Arch Bay P-03', size: '3×3m', status: 'taken', reservedBy: 'Afro Threads' },
  { id: 'P-04', tier: 'standard', zone: 'Pergola East', label: 'Arch Bay P-04', size: '3×3m', status: 'available' },
  { id: 'P-05', tier: 'standard', zone: 'Pergola East', label: 'Arch Bay P-05', size: '3×3m', status: 'available' },
  { id: 'P-06', tier: 'standard', zone: 'Pergola East', label: 'Arch Bay P-06', size: '3×3m', status: 'available' },
  { id: 'P-07', tier: 'standard', zone: 'Pergola East', label: 'Arch Bay P-07', size: '3×3m', status: 'taken', reservedBy: 'Street Eats' },
  { id: 'P-08', tier: 'standard', zone: 'Pergola East', label: 'Arch Bay P-08', size: '3×3m', status: 'available' },

  // Historic Grail Cell Vaults (double - 3.5x3.5m)
  { id: 'C-01', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-01', size: '3.5×3.5m', status: 'taken', reservedBy: 'Kicksurge NG' },
  { id: 'C-02', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-02', size: '3.5×3.5m', status: 'available' },
  { id: 'C-03', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-03', size: '3.5×3.5m', status: 'available' },
  { id: 'C-04', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-04', size: '3.5×3.5m', status: 'taken', reservedBy: 'Lagos Drip Haus' },
  { id: 'C-05', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-05', size: '3.5×3.5m', status: 'available' },
  { id: 'C-06', tier: 'double', zone: 'The Grail Cells', label: 'Cell Vault C-06', size: '3.5×3.5m', status: 'available' },

  // Double Pergola Corner Pavilion (premium - 4x4m)
  { id: 'A-01', tier: 'premium', zone: 'Amphitheatre North Corner', label: 'Junction Corner A-01', size: '4×4m', status: 'taken', reservedBy: 'The Sneaker Lab' },
  { id: 'A-02', tier: 'premium', zone: 'Amphitheatre South Corner', label: 'Junction Corner A-02', size: '4×4m', status: 'available' },
  { id: 'A-03', tier: 'premium', zone: 'Pergola East Crossway', label: 'Junction Corner A-03', size: '4×4m', status: 'available' },
  { id: 'A-04', tier: 'premium', zone: 'Pergola West Crossway', label: 'Junction Corner A-04', size: '4×4m', status: 'available' },

  // Monument Experiential Takeover (collab - 8x8m)
  { id: 'M-01', tier: 'collab', zone: 'Central Colonial Monument', label: 'Monument Plinth M-01', size: '8×8m', status: 'taken', reservedBy: 'Catalyst Lab' },
  { id: 'M-02', tier: 'collab', zone: 'Fountain Promenade Stage', label: 'Promenade Stage M-02', size: '8×8m', status: 'available' },
]"""

if target in content:
    content = content.replace(target, replacement)
    print("Direct target found and replaced!")
else:
    # Normalize CRLF
    content_norm = content.replace("\\r\\n", "\\n")
    target_norm = target.replace("\\r\\n", "\\n")
    if target_norm in content_norm:
        content_norm = content_norm.replace(target_norm, replacement)
        content = content_norm
        print("Normalized target found and replaced!")
    else:
        print("Target NOT found in content")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
