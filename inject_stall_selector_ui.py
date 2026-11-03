import os

file_path = r"C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\src\sections\VendorReg.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update form initial state
old_form = """    paymentPlan: 'full', // 'full' or 'split'
    selectedAddOns: [],
    estimatedMargin: 25000,"""

new_form = """    paymentPlan: 'full', // 'full' or 'split'
    selectedStall: 'P-04',
    selectedAddOns: [],
    estimatedMargin: 25000,"""

if old_form in content:
    content = content.replace(old_form, new_form)
    print("Form state updated with selectedStall!")

# 2. Add stallZoneFilter state
old_states = """  const [pitchError, setPitchError] = useState('')
  const [vendorCatFilter, setVendorCatFilter] = useState('ALL')"""

new_states = """  const [pitchError, setPitchError] = useState('')
  const [vendorCatFilter, setVendorCatFilter] = useState('ALL')
  const [stallZoneFilter, setStallZoneFilter] = useState('ALL')"""

if old_states in content:
    content = content.replace(old_states, new_states)
    print("stallZoneFilter state added!")

# 3. Replace Floor Plan visualizer in Step 0
old_floorplan = """                    {/* Venue Floor Plan Visualizer */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                        {MAP_ZONES.map(z => {
                          const booth = BOOTHS.find(b => b.id === z.id)
                          const isSel = form.booth === z.id
                          const spotsTaken = taken[z.id] || 0
                          const spotsLeft = (booth ? booth.capacity : 0) - spotsTaken
                          const isFull = spotsLeft <= 0
                          return (
                            <div
                              key={z.id}
                              onClick={() => !isFull && setForm(f => ({ ...f, booth: z.id }))}
                              style={{
                                padding: '12px 14px',
                                borderRadius: 8,
                                cursor: isFull ? 'not-allowed' : 'pointer',
                                background: isSel ? `${B.neonCyan}15` : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isSel ? B.neonCyan : 'rgba(255,255,255,0.08)'}`,
                                opacity: isFull ? 0.45 : 1,
                                transition: 'all 0.2s',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: isSel ? B.neonCyan : B.white, fontWeight: 700 }}>
                                  {z.label}
                                </span>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: isFull ? B.neonMagenta : isSel ? B.neonCyan : B.smoke }}>
                                  {isFull ? 'FULL' : `${spotsLeft} LEFT`}
                                </span>
                              </div>
                              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.dim }}>{z.hint}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>"""

new_floorplan = """                    {/* INTERACTIVE FREEDOM PARK STALL VISUALIZER & RESERVATION MAP */}
                    <div style={{ marginBottom: 26, padding: '18px 20px', background: 'rgba(0,240,255,0.02)', border: `1px solid ${B.neonCyan}25`, borderRadius: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                        <div>
                          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: B.neonCyan, letterSpacing: 2, fontWeight: 700 }}>
                            📍 FREEDOM PARK, CMS — INTERACTIVE STALL SELECTOR
                          </div>
                          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, marginTop: 2 }}>
                            Click any available physical bay or cell to lock your brand's footprint on the floorplan.
                          </div>
                        </div>

                        {/* Zone Filter Tabs */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {[
                            { id: 'ALL', label: 'ALL 20 STALLS' },
                            { id: 'standard', label: 'PERGOLA BAYS (P)' },
                            { id: 'double', label: 'GRAIL CELLS (C)' },
                            { id: 'premium', label: 'CORNER JUNCTIONS (A)' },
                            { id: 'collab', label: 'MONUMENT (M)' },
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setStallZoneFilter(t.id)}
                              style={{
                                padding: '4px 9px',
                                borderRadius: 4,
                                border: `1px solid ${stallZoneFilter === t.id ? B.neonCyan : 'rgba(255,255,255,0.1)'}`,
                                background: stallZoneFilter === t.id ? `${B.neonCyan}20` : 'transparent',
                                color: stallZoneFilter === t.id ? B.neonCyan : B.smoke,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 8,
                                letterSpacing: 1,
                                cursor: 'pointer',
                              }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Stalls Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                        {FREEDOM_PARK_STALLS
                          .filter(s => stallZoneFilter === 'ALL' || s.tier === stallZoneFilter)
                          .map(s => {
                            const isSelected = form.selectedStall === s.id
                            const isTaken = s.status === 'taken'
                            const tierColor = s.tier === 'collab' ? B.neonMagenta : s.tier === 'premium' ? B.amber : s.tier === 'double' ? B.neonCyan : B.neonLime

                            return (
                              <div
                                key={s.id}
                                onClick={() => {
                                  if (!isTaken) {
                                    setForm(f => ({ ...f, booth: s.tier, selectedStall: s.id }))
                                  }
                                }}
                                style={{
                                  padding: '10px 10px',
                                  borderRadius: 8,
                                  border: `1.5px solid ${isSelected ? B.neonCyan : isTaken ? 'rgba(255,255,255,0.06)' : `${tierColor}40`}`,
                                  background: isSelected ? `${B.neonCyan}20` : isTaken ? 'rgba(15,15,20,0.6)' : 'rgba(255,255,255,0.02)',
                                  cursor: isTaken ? 'not-allowed' : 'pointer',
                                  opacity: isTaken ? 0.45 : 1,
                                  transition: 'all 0.2s ease',
                                  position: 'relative',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, color: isSelected ? B.white : tierColor }}>
                                    {s.id}
                                  </span>
                                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, color: isTaken ? '#ff4d4d' : isSelected ? B.neonCyan : B.neonLime }}>
                                    {isTaken ? 'TAKEN' : isSelected ? 'SELECTED' : 'FREE'}
                                  </span>
                                </div>
                                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: isSelected ? B.white : B.smoke, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {s.label}
                                </div>
                                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, color: B.dim, marginTop: 2 }}>
                                  {s.size} · {s.zone}
                                </div>
                                {isTaken && s.reservedBy && (
                                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, color: '#888', marginTop: 4, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    @{s.reservedBy}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>

                      {/* Selected Stall Callout Pill */}
                      {form.selectedStall && (
                        <div style={{ marginTop: 12, padding: '8px 14px', background: `${B.neonCyan}12`, border: `1px solid ${B.neonCyan}40`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.white }}>
                            🎯 ALLOCATED SPOT: <strong style={{ color: B.neonCyan }}>STALL [{form.selectedStall}]</strong> ({selectedBooth.label}) &bull; Freedom Park, CMS
                          </span>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.neonLime }}>
                            ✓ RESERVATION LOCKED IN PROFORMA INVOICE
                          </span>
                        </div>
                      )}
                    </div>"""

if old_floorplan in content:
    content = content.replace(old_floorplan, new_floorplan)
    print("Floorplan selector replaced with Interactive Freedom Park Stall Selector!")
else:
    print("Floorplan target not found directly. Checking normalized...")
    content_norm = content.replace("\\r\\n", "\\n")
    old_norm = old_floorplan.replace("\\r\\n", "\\n")
    if old_norm in content_norm:
        content = content_norm.replace(old_norm, new_floorplan)
        print("Normalized floorplan replaced!")
    else:
        print("Floorplan target completely NOT found.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
