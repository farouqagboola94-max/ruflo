'use client'

import { FormEvent, useState } from 'react'
import { NetlifyFormState, submitNetlifyForm } from '@/lib/netlifyForms'

type FieldState = Record<string, string>

const inputClass = 'w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-brand-orange'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400'

function StatusMessage({ state }: { state: NetlifyFormState }) {
  if (state === 'idle' || state === 'submitting') return null

  return (
    <p
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
        state === 'success'
          ? 'border-brand-neon/30 bg-brand-neon/10 text-brand-neon'
          : 'border-brand-orange/30 bg-brand-orange/10 text-brand-orange'
      }`}
    >
      {state === 'success'
        ? 'Received. The Sneakers Fest team can now follow up from this record.'
        : 'The form did not send. Try again shortly or use the official social links.'}
    </p>
  )
}

function HiddenFormFields({ formName }: { formName: string }) {
  return (
    <>
      <input type="hidden" name="form-name" value={formName} />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>
    </>
  )
}

function TextField({
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'url'
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        name={name}
        maxLength={254}
        type={type}
        required={required}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  )
}

function SelectField({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map(option => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function TextAreaField({
  name,
  label,
  value,
  onChange,
  placeholder,
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        required
        maxLength={5000}
        rows={5}
        className={inputClass}
      />
    </label>
  )
}

function useLeadForm(initialState: FieldState, formName: string) {
  const [fields, setFields] = useState(initialState)
  const [status, setStatus] = useState<NetlifyFormState>('idle')

  function setField(name: string, value: string) {
    setFields(current => ({ ...current, [name]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')

    try {
      await submitNetlifyForm(formName, fields, event.currentTarget)
      setStatus('success')
      setFields(initialState)
    } catch {
      setStatus('error')
    }
  }

  return { fields, setField, status, submit }
}

export function VendorInterestForm() {
  const { fields, setField, status, submit } = useLeadForm(
    {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      category: 'Sneakers / footwear',
      boothTier: 'Standard',
      socialUrl: '',
      notes: '',
      source: 'vendors-page',
    },
    'vendor-interest',
  )

  return (
    <form name="vendor-interest" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-brand-gray p-5 sm:p-7">
      <HiddenFormFields formName="vendor-interest" />
      <input type="hidden" name="source" value={fields.source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="businessName" label="Business name" value={fields.businessName} onChange={value => setField('businessName', value)} required placeholder="Brand or store name" />
        <TextField name="contactName" label="Contact name" value={fields.contactName} onChange={value => setField('contactName', value)} required placeholder="Your name" />
        <TextField name="email" label="Email" type="email" value={fields.email} onChange={value => setField('email', value)} required placeholder="you@example.com" />
        <TextField name="phone" label="Phone" type="tel" value={fields.phone} onChange={value => setField('phone', value)} placeholder="+234" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="category" label="Category" value={fields.category} onChange={value => setField('category', value)} options={['Sneakers / footwear', 'Streetwear', 'Accessories', 'Food and drinks', 'Gaming', 'Creative services', 'Other']} />
        <SelectField name="boothTier" label="Preferred booth" value={fields.boothTier} onChange={value => setField('boothTier', value)} options={['Standard', 'Premium', 'Corner', 'Not sure yet']} />
      </div>
      <TextField name="socialUrl" label="Instagram, TikTok, or website" type="url" value={fields.socialUrl} onChange={value => setField('socialUrl', value)} placeholder="https://instagram.com/..." />
      <TextAreaField name="notes" label="What do you want to sell or activate?" value={fields.notes} onChange={value => setField('notes', value)} placeholder="Briefly describe your products, stock, and setup needs." />
      <button type="submit" disabled={status === 'submitting'} className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow px-5 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
        {status === 'submitting' ? 'Sending interest...' : 'Send vendor interest'}
      </button>
      <p className="text-xs text-gray-400">We use these details to respond to your request. <a href="/privacy" className="underline">Privacy</a></p>
      <StatusMessage state={status} />
    </form>
  )
}

export function SponsorInterestForm() {
  const { fields, setField, status, submit } = useLeadForm(
    {
      company: '',
      contactName: '',
      email: '',
      phone: '',
      budget: 'Still exploring',
      partnershipType: 'Brand activation',
      goals: '',
      source: 'sponsors-page',
    },
    'sponsor-interest',
  )

  return (
    <form name="sponsor-interest" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-brand-gray p-5 sm:p-7">
      <HiddenFormFields formName="sponsor-interest" />
      <input type="hidden" name="source" value={fields.source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="company" label="Company" value={fields.company} onChange={value => setField('company', value)} required placeholder="Brand name" />
        <TextField name="contactName" label="Contact name" value={fields.contactName} onChange={value => setField('contactName', value)} required placeholder="Your name" />
        <TextField name="email" label="Email" type="email" value={fields.email} onChange={value => setField('email', value)} required placeholder="you@example.com" />
        <TextField name="phone" label="Phone" type="tel" value={fields.phone} onChange={value => setField('phone', value)} placeholder="+234" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="budget" label="Budget range" value={fields.budget} onChange={value => setField('budget', value)} options={['Still exploring', 'Below N250k', 'N250k-N500k', 'N500k-N1m', 'N1m-N5m', 'N5m+', 'Title partnership']} />
        <SelectField name="partnershipType" label="Partnership type" value={fields.partnershipType} onChange={value => setField('partnershipType', value)} options={['Brand activation', 'Media partnership', 'Product sampling', 'Creator campaign', 'Gaming partnership', 'Ticketing / platform', 'Other']} />
      </div>
      <TextAreaField name="goals" label="Commercial goal" value={fields.goals} onChange={value => setField('goals', value)} placeholder="Tell us what your brand wants from Sneakers Fest." />
      <button type="submit" disabled={status === 'submitting'} className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow px-5 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
        {status === 'submitting' ? 'Sending enquiry...' : 'Send sponsor enquiry'}
      </button>
      <p className="text-xs text-gray-400">We use these details to respond to your request. <a href="/privacy" className="underline">Privacy</a></p>
      <StatusMessage state={status} />
    </form>
  )
}

export function ContactForm() {
  const { fields, setField, status, submit } = useLeadForm(
    {
      name: '',
      email: '',
      topic: 'General question',
      message: '',
      source: 'contact-page',
    },
    'contact',
  )

  return (
    <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-brand-gray p-5 sm:p-7">
      <HiddenFormFields formName="contact" />
      <input type="hidden" name="source" value={fields.source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Name" value={fields.name} onChange={value => setField('name', value)} required placeholder="Your name" />
        <TextField name="email" label="Email" type="email" value={fields.email} onChange={value => setField('email', value)} required placeholder="you@example.com" />
      </div>
      <SelectField name="topic" label="Topic" value={fields.topic} onChange={value => setField('topic', value)} options={['General question', 'Press', 'Tickets', 'Accessibility', 'Vendor', 'Sponsor', 'Community Cup', 'Privacy / unsubscribe']} />
      <TextAreaField name="message" label="Message" value={fields.message} onChange={value => setField('message', value)} placeholder="What do you need help with?" />
      <button type="submit" disabled={status === 'submitting'} className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow px-5 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
        {status === 'submitting' ? 'Sending message...' : 'Send message'}
      </button>
      <p className="text-xs text-gray-400">We use these details to respond to your request. <a href="/privacy" className="underline">Privacy</a></p>
      <StatusMessage state={status} />
    </form>
  )
}
