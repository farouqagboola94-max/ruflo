// Public vendor directory + door-scoped authorisation.
//
// Run: node tests/vendors-auth.test.mjs
//
// Two things are being protected here: a vendor's contact details, which they
// gave in order to apply and not to have published; and the separation
// between a code handed to gate staff and one that can read the event's data.

import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const dir = await mkdtemp(join(tmpdir(), 'sf26-vend-'))
await mkdir(join(dir, 'lib'), { recursive: true })

// Storage stub seeded with one approved, one pending and one rejected vendor.
await writeFile(join(dir, 'lib', 'storage.js'), `
export const rows = [
  { applicationId: 'VN-1', status: 'approved', business: 'Zulu Kicks', category: 'Sneakers',
    email: 'zulu@example.com', phone: '08012345678', booth: 'A4',
    instagram: '@zulukicks', website: 'https://zulu.example', bio: 'Deadstock only.',
    exclusiveDrop: 'Ten pairs, day one' },
  { applicationId: 'VN-2', status: 'approved', business: 'Ade Customs', category: 'Custom',
    email: 'ade@example.com', phone: '08087654321', bio: 'x'.repeat(400) },
  { applicationId: 'VN-3', status: 'pending', business: 'Not Confirmed Yet', category: 'Sneakers',
    email: 'pending@example.com' },
  { applicationId: 'VN-4', status: 'rejected', business: 'Turned Down', category: 'Food',
    email: 'no@example.com' },
]
export const Vendors = () => 'vendors'
export async function listAll() { return rows }
`)
await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await copyFile(join(FN, 'lib', 'auth.js'), join(dir, 'lib', 'auth.js'))
await copyFile(join(FN, 'vendors-public.js'), join(dir, 'vendors-public.js'))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

const { handler } = await import(pathToFileURL(join(dir, 'vendors-public.js')).href)
const json = r => JSON.parse(r.body)
const get = () => handler({ httpMethod: 'GET', headers: {} })

console.log('directory:')
const res = await get()
check('returns 200', res.statusCode === 200)
check('only approved vendors are listed', json(res).total === 2)
check('a pending vendor is not published',
  json(res).vendors.every(v => v.business !== 'Not Confirmed Yet'))
check('a rejected vendor is not published',
  json(res).vendors.every(v => v.business !== 'Turned Down'))

const body = JSON.stringify(json(res))
check('vendor emails are never exposed', !body.includes('@example.com'))
check('vendor phone numbers are never exposed',
  !body.includes('08012345678') && !body.includes('08087654321'))

check('vendors are sorted alphabetically',
  json(res).vendors[0].business === 'Ade Customs')
check('categories are derived for the filter',
  JSON.stringify(json(res).categories) === JSON.stringify(['Custom', 'Sneakers']))
check('exclusives are counted', json(res).withExclusive === 1)
check('a long bio is trimmed for the grid',
  json(res).vendors.find(v => v.business === 'Ade Customs').bio.length === 240)
check('booth and socials survive',
  json(res).vendors.find(v => v.business === 'Zulu Kicks').booth === 'A4')
check('POST is refused',
  (await handler({ httpMethod: 'POST', headers: {} })).statusCode === 405)

// ── Door-scoped auth ──────────────────────────────────────────────────
console.log('\ndoor vs admin secret:')
const { requireAdmin, requireDoor } = await import(pathToFileURL(join(dir, 'lib', 'auth.js')).href)
const ev = secret => ({ headers: secret ? { authorization: `Bearer ${secret}` } : {} })

process.env.ADMIN_SECRET = 'admin_secret_value'
delete process.env.DOOR_SECRET

check('without DOOR_SECRET the admin code still opens the door',
  requireDoor(ev('admin_secret_value')) === null)
check('a wrong code is refused', requireDoor(ev('nope'))?.statusCode === 401)

process.env.DOOR_SECRET = 'door_secret_value'

check('the door code opens the door', requireDoor(ev('door_secret_value')) === null)
check('the admin code still opens the door', requireDoor(ev('admin_secret_value')) === null)
check('a wrong code is still refused', requireDoor(ev('nope'))?.statusCode === 401)
check('no code at all is refused', requireDoor(ev(null))?.statusCode === 401)

// This is the separation that matters: gate staff cannot read the data.
check('the DOOR code does NOT open the admin endpoints',
  requireAdmin(ev('door_secret_value'))?.statusCode === 401)
check('the admin code still opens the admin endpoints',
  requireAdmin(ev('admin_secret_value')) === null)

delete process.env.ADMIN_SECRET
check('with no admin secret configured, admin fails closed',
  requireAdmin(ev('anything'))?.statusCode === 503)

await rm(dir, { recursive: true, force: true })

console.log(`\nvendors-auth: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
