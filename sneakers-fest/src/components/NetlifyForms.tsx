export default function NetlifyForms() {
  return (
    <div hidden aria-hidden="true">
      <form name="waitlist" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="waitlist" />
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="interest" />
        <input name="source" />
        <input name="refCode" />
      </form>

      <form name="newsletter" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="newsletter" />
        <input name="bot-field" />
        <input name="email" />
        <input name="interests" />
        <input name="source" />
      </form>

      <form name="community-cup-interest" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="community-cup-interest" />
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="team" />
        <input name="role" />
      </form>

      <form name="vendor-interest" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="vendor-interest" />
        <input name="bot-field" />
        <input name="businessName" />
        <input name="contactName" />
        <input name="email" />
        <input name="phone" />
        <input name="category" />
        <input name="boothTier" />
        <input name="socialUrl" />
        <textarea name="notes" />
        <input name="source" />
      </form>

      <form name="sponsor-interest" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="sponsor-interest" />
        <input name="bot-field" />
        <input name="company" />
        <input name="contactName" />
        <input name="email" />
        <input name="phone" />
        <input name="budget" />
        <input name="partnershipType" />
        <textarea name="goals" />
        <input name="source" />
      </form>

      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact" />
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="topic" />
        <textarea name="message" />
        <input name="source" />
      </form>
      <form name="marketplace-interest" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="marketplace-interest" />
        {['bot-field', 'name', 'brand', 'size', 'price', 'condition', 'type', 'contact', 'source'].map(name => <input key={name} name={name} />)}
      </form>
    </div>
  )
}
