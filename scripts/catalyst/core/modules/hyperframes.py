"""CatalystOS Module: HeyGen Hyperframes"""
import datetime, json, uuid, os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "avatar_sessions")
os.makedirs(OUTPUT_DIR, exist_ok=True)

AVATARS = {
    "catalyst_pro":  {"name":"The Catalyst",     "voice":"confident_afro_brit","expressions":["neutral","assertive","thoughtful","engaging"]},
    "legal_counsel": {"name":"Counsel",           "voice":"formal_nigerian",    "expressions":["neutral","authoritative","empathetic"]},
    "event_host":    {"name":"Sneakers Fest Host","voice":"energetic_lagos",    "expressions":["excited","hype","engaging","neutral"]},
    "educator":      {"name":"Educator",          "voice":"clear_instructional","expressions":["neutral","explaining","engaging"]},
}

class HeyGenSession:
    def __init__(self, avatar_key="catalyst_pro"):
        av = AVATARS.get(avatar_key, AVATARS["catalyst_pro"])
        self.session_id = f"HYG-{uuid.uuid4().hex[:8].upper()}"
        self.avatar = av; self.segments = []
        self.created_at = datetime.datetime.now().isoformat()

    def speak(self, text, expression="neutral"):
        dur = len(text.split()) / 2.5
        seg = {"id":len(self.segments)+1,"text":text,"expression":expression,"duration_sec":round(dur,2),"status":"QUEUED"}
        self.segments.append(seg); return seg

    def export(self):
        total = sum(s["duration_sec"] for s in self.segments)
        config = {"session_id":self.session_id,"avatar":self.avatar,"segments":self.segments,
                  "total_duration_sec":round(total,2),"fps":30,"resolution":"1080p","status":"READY"}
        with open(os.path.join(OUTPUT_DIR,f"{self.session_id}.json"),"w") as f: json.dump(config,f,indent=2)
        return config

class HeyGenHyperframes:
    def __init__(self): self.sessions = []
    def create_session(self, key="catalyst_pro"):
        s = HeyGenSession(key); self.sessions.append(s); return s
    def substack_promo(self, title, hook, cta):
        s = self.create_session("catalyst_pro")
        for line in [hook, f"This is what {title} is really about.", "Here's what nobody tells you.", cta]:
            s.speak(line, "assertive")
        return s.export()
    def sneakers_fest_hype(self, date, venue):
        s = self.create_session("event_host")
        for line, expr in [("Lagos. It's time.","hype"),(f"Sneakers Fest 2026 — {venue} — {date}.","excited"),("West Africa's biggest sneaker festival.","hype"),("Register now. Limited spots.","engaging")]:
            s.speak(line, expr)
        return s.export()
    def legal_explainer(self, topic, explanation):
        s = self.create_session("legal_counsel")
        s.speak(f"Today: {topic}", "authoritative")
        for sent in [x.strip() for x in explanation.split(".") if x.strip()]:
            s.speak(sent + ".", "neutral")
        s.speak("Contact Abegbe Agboola Chambers, Ikoyi, Lagos.", "empathetic")
        return s.export()
    def list_avatars(self):
        return [{"key":k,"name":v["name"],"voice":v["voice"]} for k,v in AVATARS.items()]

if __name__ == "__main__":
    hg = HeyGenHyperframes()
    p = hg.substack_promo("The Great Sabotage Part 10","Most people build downstream.","Read it on Substack.")
    print(f"✅ Substack: {p['session_id']} | {p['total_duration_sec']}s")
    f = hg.sneakers_fest_hype("July 19 2026","Eko Convention Centre")
    print(f"✅ Sneakers Fest: {f['session_id']} | {f['total_duration_sec']}s")
    print(f"✅ Total sessions: {len(hg.sessions)}")
