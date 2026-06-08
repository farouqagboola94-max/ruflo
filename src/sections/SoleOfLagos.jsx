import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const PARTS = [
  {
    num: '01', era: '1945 -- 1989', color: B.smoke,
    title: 'BEFORE HYPE WAS A WORD', sub: 'The Import Era',
    pull: 'The bend-down-select economy was not based on affordability. It was based on access.',
    body: `Nigeria's relationship with footwear was shaped long before global brands discovered Africa as a market. In the colonial period and after independence in 1960, shoes were markers of class and aspiration. To wear leather was to signal education, opportunity, and proximity to the formal economy. Bare feet meant the village. Hard soles meant the city. The hierarchy was brutal, simple, and widely understood.\n\nThe Alaba International Market became a conduit for imported goods arriving through grey channels. Traders who traveled to the United States, United Kingdom, Dubai, and China came back with suitcases full of things the formal retail economy had not yet brought to Nigeria. The okrika markets in Yaba, Katangowa, and Cotonou were weekend destinations. Young Lagosians spent hours picking through bales of imported goods. "Bend-down select" entered Lagos slang. You bent down to sift through piles of secondhand items on tarps, searching for that one good pair buried in the pile.\n\nMost histories of Nigerian sneaker culture miss a massive point. The people doing this were not poor. Lagos has always had a middle class with purchasing power that foreign brands chronically underestimated. The brands simply were not here. So Lagos found a way around them.`,
  },
  {
    num: '02', era: '1984 -- 1999', color: B.neonCyan,
    title: 'THE JORDAN EFFECT', sub: 'How Basketball Rewired Lagos',
    pull: 'A generation of Lagosians became the most sneaker-literate consumers in the world out of pure necessity.',
    body: `In 1985, Nike released a shoe for a second-year NBA player named Michael Jordan. The NBA fined him $5,000 every game he wore them because the shoe violated the league's uniform policy. Nike paid every fine. The attention was worth more than the money. A legend was manufactured in real time.\n\nLagos did not see it in 1985. Lagos saw it later through satellite television. The arrival of DSTV in the mid-1990s changed everything. Suddenly, the Nigerian middle class could watch NBA games live. Boys who had never held a basketball started arguing about whether the 11 was better than the 6. Markets began specifically sourcing Jordans. The Lagos street market became a masterclass in sneaker literacy. You had to know the difference between real and fake just to buy shoes -- the vendors were not always going to tell you the truth. A generation of Lagosians became the most sneaker-literate consumers in the world out of pure necessity.\n\nHakeem Olajuwon was born in Lagos. He became an NBA champion in 1994 and 1995 and had his own signature shoe with FILA called "The Dream." The world's best basketball player was from this exact city. That was local. That was proof that Lagos produced greatness the world had to reckon with.`,
  },
  {
    num: '03', era: '2000s', color: B.amber,
    title: 'AFROCENTRIC STREETWEAR FINDS ITS FOOTING', sub: 'The Democracy Dividend',
    pull: 'It stopped being a translation. It became something original -- a Lagos remix of global street culture with its own internal logic.',
    body: `The early 2000s were a period of economic and political recalibration. With the return to civilian democracy in 1999, a new energy entered the city. Youth culture expanded. Nollywood was booming. The Palms Shopping Mall in Lekki opened in 2005 -- for the first time, Lagos had a contemporary retail environment that felt global. What you wore to The Palms was entirely different from what you wore to Ojuelegba.\n\nBut the Lagos sneaker ecosystem was still primarily informal. The Alaba traders were now working in a more sophisticated market. They sourced specific models on request and built relationships with diaspora Nigerians in the US and UK who could buy limited releases and ship them back. A primitive reseller economy was already functioning years before StockX existed.\n\nHip-hop was the cultural engine. Jay-Z, Nas, Kanye West, and Pharrell Williams translated their aesthetics directly into Lagos street fashion. The Air Force 1 and the Air Max 90 were not just shoes. They were cultural statements imported wholesale from Black American culture into Lagos youth identity. The translation was so complete that it stopped being a translation. It became something original.`,
  },
  {
    num: '04', era: '2010s', color: B.neonMagenta,
    title: 'INSTAGRAM, HYPE, AND THE LAGOS SNEAKERHEAD', sub: 'The Feed Changes Everything',
    pull: 'Sneakers are part of the global Black creative identity, and Nigerian artists are at the exact center of that identity.',
    body: `Instagram launched in 2010. By 2014 it had rewritten the global fashion economy. By 2016 it had rewritten Lagos.\n\nFor the first time, a young person in Lagos could follow Sneaker News, see what Kanye wore to Paris Fashion Week, watch Virgil Abloh's Instagram stories, and participate in global sneaker culture in real time. The geographic barriers that had made Lagos a perpetual afterthought in the global sneaker conversation finally began to erode. Wizkid broke globally with "One Dance" alongside Drake in 2016. Burna Boy cultivated an aesthetic drawing heavily on global streetwear. Davido wore Jordans at concerts. Sneakers are part of the global Black creative identity, and Nigerian artists were at the exact center of that identity.\n\nVirgil Abloh was a particular totem for this community. The Ghanaian-American designer reached the summit of global fashion as the Creative Director of Louis Vuitton Men's. His "The Ten" Nike collection in 2017 was arguably the most significant sneaker collaboration of the decade. When Virgil created the Air Jordan 1 Off-White "Chicago," Lagos felt the energy most acutely. It felt like an ancestor finally being recognized.`,
  },
  {
    num: '05', era: 'TODAY', color: B.neonLime,
    title: 'THE RESELLER ECONOMY', sub: 'Lagos Flippers and the Informal Premium Market',
    pull: 'Desire is infrastructure. Where desire exists at this intensity, markets always form.',
    body: `Today, Lagos has a fully functioning sneaker resale economy. It is informal, Instagram-driven, and entirely Lagos in character -- adaptive, fast-moving, and built on personal relationships.\n\nA Lagos sneaker reseller might be a university student who follows every Nike SNKRS drop at 3am. They buy through a VPN using a US address, ship to a cousin in London, and resell at a 40-80% premium to a Lagos buyer who could not access the drop. The logistics are complex. The margins are high. The community has its own codes. Comment sections function as informal marketplaces. The trust economy is built entirely on reputation. One bad deal spreads faster than ten good ones.\n\nThe Lagos reseller economy demonstrates a simple truth: desire is infrastructure. The formal infrastructure was absent for decades. No Nike flagship store. No official Jordan Brand release events. No legal pathway to limited drops. But desire was present. Desire is what Lagos built its version on. Where desire exists at this intensity, markets always form.`,
  },
  {
    num: '06', era: '2017 -- 2024', color: B.amber,
    title: 'THE AFROBEATS GLOBALIZATION EFFECT', sub: 'When Lagos Became Fashion\'s Reference Point',
    pull: 'The global fashion industry had historically defined Africa as a market to sell to. Now they had to learn from it.',
    body: `The period from 2017 to 2024 was extraordinary in Nigerian cultural history. Afrobeats went from a genre known primarily in Africa and the diaspora to a global dominant force. Burna Boy won a Grammy. Wizkid sold out the O2 Arena. Davido collaborated with artists across four continents. A new generation of Nigerian artists rewrote the global pop conversation.\n\nThe fashion implications were direct. Nigerian artists on global stages meant Nigerian aesthetics on global stages. Aso-Oke fabric appeared in music videos alongside Jordan 1s. Lagos street style was documented by Instagram accounts and picked up by i-D, Hypebeast, and Vogue. The global fashion industry had historically defined Africa as a market to sell to. Now they began to acknowledge that something was happening here they needed to learn from.\n\nFor sneaker culture specifically, this meant the Lagos collector and the Lagos reseller were finally legible to the global market. The conversation about what Lagos wants from sneaker culture found an audience that extended beyond the city's own limits.`,
  },
  {
    num: '07', era: 'THE DIASPORA', color: B.neonCyan,
    title: 'THE GLOBAL NIGERIAN', sub: 'Diaspora and the Sneaker Supply Chain',
    pull: 'The Lagos consumer understands cultural capital. They pay for it because they know exactly what they are buying.',
    body: `An underappreciated structural element of Lagos sneaker culture is the Nigerian diaspora.\n\nNigerians in the United States, United Kingdom, and Canada have always functioned as a supply chain for goods unavailable in Lagos. For limited sneakers, this connection was essential. A cousin in Atlanta could camp outside a Foot Locker. A brother in London could enter SNKRS ballots with UK credentials. The shoes arrived in Lagos through informal shipping networks, people traveling home, and local courier services.\n\nThis diaspora supply chain created the Lagos premium market. Shoes retailing at $180 in the US arrived in Lagos with significant markups. At today's exchange rates, limited sneakers traded in Lagos carry premiums that would be considered extraordinary in any global market. But the premium exists because the desire exists. Lagos consumers with the economic power to participate understand what a shoe means. They understand cultural capital. They pay for it because they know exactly what they are buying.`,
  },
  {
    num: '08', era: 'DEC 12, 2026', color: B.neonMagenta,
    title: 'SNEAKERS FEST 2026', sub: 'The Watershed Moment',
    pull: 'Lagos has been talking about sneakers for decades. Sneakers Fest 2026 is Lagos finally speaking into a microphone.',
    body: `Every culture reaches a moment when its informal expressions demand formal recognition. The things happening in bedrooms, markets, and comment sections need a stage large enough to match their actual significance.\n\nThat moment for Lagos sneaker culture is December 12, 2026, at Muri Okunola Park.\n\nThe 200 sneakers documented in the Vault 200 represent the greatest footwear ever manufactured. They represent the language Lagos youth have been speaking for forty years. They represent the aspirations of a generation that watched Nike on satellite television and decided to take it for themselves. They represent the ambition of resellers who woke up at 3am to buy a shoe from a server in New Jersey to sell it at a premium in Lekki. They represent the Metal Dragon energy of a city that refuses to be peripheral. Lagos has been talking about sneakers for decades. Sneakers Fest 2026 is Lagos finally speaking into a microphone.`,
  },
]

const R = { '\\n\\n': '\n\n' }

export default function SoleOfLagos() {
  return (
    <section id="sole-of-lagos" style={{ background: B.black, color: B.white, position: 'relative', overflow: 'hidden', padding: '100px 0 120px' }}>
      <GrainOverlay />
      <ScanLines />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>

        <SectionTag text="EXHIBITION ESSAY" color={B.amber} />

        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 11vw, 130px)', lineHeight: 0.85, marginBottom: 32, marginTop: 24 }}>
          <div style={{ color: B.white }}>THE SOLE</div>
          <div style={{ color: B.amber }}>OF LAGOS</div>
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.3em', color: B.smoke, marginBottom: 64, textTransform: 'uppercase' }}>
          A History of Sneaker Culture, Identity, and the Streets That Built an Empire
        </div>

        <div style={{ borderLeft: `4px solid ${B.amber}`, paddingLeft: 32, marginBottom: 88 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: 1.9, color: B.white, marginBottom: 28 }}>
            There is a version of this story that starts with Michael Jordan. Do not believe it.
            The real story starts in a container ship pulling into Apapa Port sometime in the 1970s.
            It was carrying secondhand American goods that nobody on the docks could have imagined
            would one day define the identity of a generation. It starts right here in Lagos.
            This city has always understood what something is worth before the rest of the world catches on.
          </p>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 4vw, 38px)', color: B.amber, letterSpacing: '0.04em', lineHeight: 1.1 }}>
            SNEAKERS ARE CURRENCY HERE. THEY ALWAYS WERE.
          </div>
        </div>

        {PARTS.map((p, i) => (
          <div key={i} style={{ marginBottom: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: p.color, letterSpacing: '0.3em', flexShrink: 0 }}>{p.num}</div>
              <div style={{ flex: 1, height: 1, background: p.color + '40' }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, letterSpacing: '0.2em', flexShrink: 0, textTransform: 'uppercase' }}>{p.era}</div>
            </div>

            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 52px)', color: p.color, lineHeight: 0.9, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, letterSpacing: '0.2em', marginBottom: 28, textTransform: 'uppercase' }}>{p.sub}</div>

            {p.body.split('\n\n').map((para, j) => (
              <p key={j} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(14px, 1.7vw, 17px)', lineHeight: 1.9, color: 'rgba(240,237,230,0.82)', marginBottom: 20 }}>{para}</p>
            ))}

            <blockquote style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 24, margin: '32px 0 0', background: p.color + '0A', padding: '18px 24px' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 700, color: p.color, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{p.pull}&rdquo;
              </div>
            </blockquote>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${B.amber}30`, paddingTop: 40, marginTop: 24, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, letterSpacing: '0.25em' }}>
            SNEAKERS FEST 2026 &mdash; MURI OKUNOLA PARK, V/I, LAGOS &mdash; DECEMBER 12
          </div>
        </div>

      </div>
    </section>
  )
}
