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
    </div>
  )
}
