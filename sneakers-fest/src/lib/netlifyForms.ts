export type NetlifyFormState = 'idle' | 'submitting' | 'success' | 'error'

export function encodeNetlifyForm(data: Record<string, string>) {
  return new URLSearchParams(data).toString()
}

export async function submitNetlifyForm(formName: string, fields: Record<string, string>) {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeNetlifyForm({
      'form-name': formName,
      ...fields,
    }),
  })

  if (!response.ok) {
    throw new Error(`Netlify form submission failed with status ${response.status}`)
  }
}
