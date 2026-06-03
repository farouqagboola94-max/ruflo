export interface TicketInvoiceParams {
  ref: string
  name: string
  email: string
  phone: string
  tier: string
  quantity: number
  total: number
  qrDataUrl?: string
  purchasedAt: string
}

export interface VendorInvoiceParams {
  ref: string
  businessName: string
  contactName: string
  email: string
  phone: string
  tier: string
  size: string
  price: number
  registeredAt: string
}

function fmt(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function drawHeader(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  title: string,
  ref: string,
  date: string,
  W: number,
  RM: number,
) {
  doc.setFillColor(10, 10, 10)
  doc.rect(0, 0, W, 52, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 107, 44)
  doc.text('SNEAKERS FEST 2026', 15, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(140, 140, 140)
  doc.text('Lagos, Nigeria  sneakersfest.ng', 15, 25)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(255, 255, 255)
  doc.text(title, 15, 44)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(140, 140, 140)
  doc.text('INVOICE NO.', RM, 16, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(ref, RM, 22, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(140, 140, 140)
  doc.text('DATE', RM, 30, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.text(date, RM, 36, { align: 'right' })

  doc.setFillColor(57, 200, 30)
  doc.roundedRect(155, 40, 40, 8, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(10, 10, 10)
  doc.text('PAYMENT CONFIRMED', 175, 45, { align: 'center' })

  doc.setFillColor(255, 107, 44)
  doc.rect(0, 52, W, 1.5, 'F')
}

function drawFooter(doc: any, W: number, LM: number, CW: number) {
  const FY = 272
  doc.setFillColor(210, 210, 210)
  doc.rect(LM, FY, CW, 0.4, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(130, 130, 130)
  doc.text(
    'This document is your official payment receipt for Sneakers Fest 2026.',
    W / 2, FY + 6, { align: 'center' },
  )
  doc.text(
    'Support: hello@sneakersfest.ng  |  vendors@sneakersfest.ng',
    W / 2, FY + 11, { align: 'center' },
  )
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 107, 44)
  doc.text('See you in Lagos!', W / 2, FY + 19, { align: 'center' })
}

export async function generateTicketInvoicePDF(p: TicketInvoiceParams): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const W = 210; const LM = 15; const RM = 195; const CW = 180

  drawHeader(doc, 'TICKET INVOICE', p.ref, fmt(p.purchasedAt), W, RM)

  // Bill To (left)
  let y = 62
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('BILLED TO', LM, y)
  y += 7
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 20, 20)
  doc.text(p.name, LM, y)
  y += 6
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
  doc.text(p.email, LM, y)
  y += 5; doc.text(p.phone, LM, y)

  // Event info (right)
  const EX = 130
  let ey = 62
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('EVENT', EX, ey)
  ey += 7
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 20, 20)
  doc.text('Sneakers Fest 2026', EX, ey)
  ey += 6
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
  doc.text('December 12-13, 2026', EX, ey)
  ey += 5; doc.text('Lagos, Nigeria', EX, ey)

  // Items table
  y = 90
  doc.setFillColor(10, 10, 10); doc.rect(LM, y, CW, 9, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('DESCRIPTION', LM + 3, y + 6)
  doc.text('QTY', LM + 108, y + 6, { align: 'center' })
  doc.text('UNIT PRICE', LM + 140, y + 6, { align: 'center' })
  doc.text('TOTAL', RM - 3, y + 6, { align: 'right' })
  y += 9

  doc.setFillColor(248, 248, 248); doc.rect(LM, y, CW, 11, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(20, 20, 20)
  doc.text(`${p.tier} Ticket`, LM + 3, y + 7.5)
  const unitPrice = Math.round(p.total / p.quantity)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.text(String(p.quantity), LM + 108, y + 7.5, { align: 'center' })
  doc.text(`NGN ${unitPrice.toLocaleString()}`, LM + 140, y + 7.5, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text(`NGN ${p.total.toLocaleString()}`, RM - 3, y + 7.5, { align: 'right' })
  y += 11

  doc.setFillColor(255, 255, 255); doc.rect(LM, y, CW, 8, 'F')
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 120, 120)
  doc.text('Sneakers Fest 2026  Dec 12-13  2-Day Access  Lagos, Nigeria', LM + 3, y + 5.5)
  y += 8

  doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(LM, y, RM, y)

  // Totals
  y += 8
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100)
  doc.text('Subtotal', RM - 55, y)
  doc.text(`NGN ${p.total.toLocaleString()}`, RM, y, { align: 'right' })
  y += 6
  doc.text('Processing fee', RM - 55, y)
  doc.setTextColor(50, 160, 50); doc.text('Included', RM, y, { align: 'right' })
  y += 8
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5); doc.line(RM - 70, y - 3, RM, y - 3)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(255, 107, 44)
  doc.text('TOTAL PAID', RM - 55, y + 5)
  doc.setFontSize(15); doc.setTextColor(10, 10, 10)
  doc.text(`NGN ${p.total.toLocaleString()}`, RM, y + 5, { align: 'right' })

  // QR code
  if (p.qrDataUrl) {
    y += 20
    const QW = 42
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
    doc.text('YOUR ENTRY QR CODE', LM, y)
    y += 4
    doc.addImage(p.qrDataUrl, 'PNG', LM, y, QW, QW)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(80, 80, 80)
    doc.text('Show this at the entrance.', LM, y + QW + 5)
    doc.text('Screenshots accepted.', LM, y + QW + 10)

    // Instructions box
    const IX = LM + QW + 10
    doc.setFillColor(248, 248, 248)
    doc.roundedRect(IX, y, 90, QW, 3, 3, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(10, 10, 10)
    doc.text('ENTRY INSTRUCTIONS', IX + 5, y + 8)
    const steps = [
      '1. Save this PDF or screenshot your QR',
      '2. Arrive at venue Dec 12 or 13, 2026',
      '3. Show QR at entry gate for scanning',
      '4. Each QR is valid for the ticket qty',
      '5. Your pass covers both event days',
    ]
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(70, 70, 70)
    steps.forEach((s, i) => doc.text(s, IX + 5, y + 16 + i * 6))
  }

  drawFooter(doc, W, LM, CW)
  doc.save(`SF-2026-TICKET-${p.ref}.pdf`)
}

export async function generateVendorInvoicePDF(p: VendorInvoiceParams): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const W = 210; const LM = 15; const RM = 195; const CW = 180

  drawHeader(doc, 'VENDOR INVOICE', p.ref, fmt(p.registeredAt), W, RM)

  // Vendor info (left)
  let y = 62
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('VENDOR / BRAND', LM, y)
  y += 7
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(20, 20, 20)
  doc.text(p.businessName, LM, y)
  y += 6
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
  doc.text(`Contact: ${p.contactName}`, LM, y)
  y += 5; doc.text(p.email, LM, y)
  y += 5; doc.text(p.phone, LM, y)

  // Event info (right)
  const EX = 130
  let ey = 62
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('EVENT', EX, ey)
  ey += 7
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 20, 20)
  doc.text('Sneakers Fest 2026', EX, ey)
  ey += 6
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
  doc.text('December 12-13, 2026', EX, ey)
  ey += 5; doc.text('Lagos, Nigeria', EX, ey)
  ey += 5; doc.text('Setup Day: December 11, 2026', EX, ey)

  // Items table
  y = 100
  doc.setFillColor(10, 10, 10); doc.rect(LM, y, CW, 9, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(255, 107, 44)
  doc.text('DESCRIPTION', LM + 3, y + 6)
  doc.text('BOOTH SIZE', LM + 115, y + 6, { align: 'center' })
  doc.text('AMOUNT', RM - 3, y + 6, { align: 'right' })
  y += 9

  doc.setFillColor(248, 248, 248); doc.rect(LM, y, CW, 11, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(20, 20, 20)
  doc.text(`${p.tier} Vendor Booth`, LM + 3, y + 7.5)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.text(p.size, LM + 115, y + 7.5, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text(`NGN ${p.price.toLocaleString()}`, RM - 3, y + 7.5, { align: 'right' })
  y += 11

  doc.setFillColor(255, 255, 255); doc.rect(LM, y, CW, 8, 'F')
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 120, 120)
  doc.text('Sneakers Fest 2026  Dec 12-13  Full 2-day vendor duration', LM + 3, y + 5.5)
  y += 8

  doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.3); doc.line(LM, y, RM, y)

  // Totals
  y += 8
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100)
  doc.text('Booth fee', RM - 55, y)
  doc.text(`NGN ${p.price.toLocaleString()}`, RM, y, { align: 'right' })
  y += 6
  doc.text('Setup day access (Dec 11)', RM - 55, y)
  doc.setTextColor(50, 160, 50); doc.text('Included', RM, y, { align: 'right' })
  y += 8
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5); doc.line(RM - 70, y - 3, RM, y - 3)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(255, 107, 44)
  doc.text('TOTAL PAID', RM - 55, y + 5)
  doc.setFontSize(15); doc.setTextColor(10, 10, 10)
  doc.text(`NGN ${p.price.toLocaleString()}`, RM, y + 5, { align: 'right' })

  // What's included checklist
  y += 22
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(255, 107, 44)
  doc.text("WHAT'S INCLUDED IN YOUR BOOTH", LM, y)
  y += 7

  const included = [
    '2-day vendor space for December 12-13, 2026',
    'Setup access from 8:00 AM on December 11, 2026',
    'Branded event listing in the Sneakers Fest catalog',
    'Electricity access and basic setup support',
    'Vendor briefing pack (2 weeks before event)',
    'Booth assignment and floor map (released Nov 2026)',
  ]
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5)
  included.forEach((line, i) => {
    if (i % 2 === 0) { doc.setFillColor(248, 248, 248) } else { doc.setFillColor(255, 255, 255) }
    doc.rect(LM, y - 1, CW, 7, 'F')
    doc.setTextColor(255, 107, 44); doc.text('>', LM + 3, y + 4.5)
    doc.setTextColor(60, 60, 60); doc.text(line, LM + 9, y + 4.5)
    y += 7
  })

  // Reference reminder box
  y += 8
  doc.setFillColor(255, 242, 230)
  doc.roundedRect(LM, y, CW, 22, 3, 3, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 107, 44)
  doc.text('IMPORTANT — SAVE YOUR REFERENCE', LM + 5, y + 7)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(10, 10, 10)
  doc.text(p.ref, LM + 5, y + 14)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(80, 40, 10)
  doc.text('Use this to log in to your Vendor Dashboard at sneakersfest.ng/vendor-dashboard', LM + 5, y + 20)

  drawFooter(doc, W, LM, CW)
  doc.save(`SF-2026-VENDOR-${p.ref}.pdf`)
}
