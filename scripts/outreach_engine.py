"""
Sneaker Fest '26 — Brand Outreach Engine
CRM Automation Framework: Draft → Verify → Adjust → Finalize loop

Usage:
    python scripts/outreach_engine.py "Nike"
    python scripts/outreach_engine.py "Adidas"
    python scripts/outreach_engine.py  # defaults to "Premium Apparel Brand"
"""

import sys
import time


def call_copywriter_node(target_brand, feedback=""):
    """The Copywriter Node: Crafts the high-energy outreach pitch."""
    print(f"\n[Copywriter] Drafting pitch for {target_brand}...")
    time.sleep(2)

    # Self-corrects on re-entry when gatekeeper flags missing event data
    if "missing vital event data" in feedback:
        return (
            f"Yo {target_brand}, the culture is moving. Sneaker Fest 2026 is officially locked for "
            f"December 12, 2026, in Lagos. We are bringing together the biggest collectors, creators, "
            f"and streetwear brands under one roof. No corporate fluff... just pure energy and high-value "
            f"footwear culture. We want your brand anchoring the main floor. Let's build a massive activation. "
            f"Reply to secure your booth space before the early bird window closes."
        )

    # First draft — simulated lazy / buzzword-heavy output for gatekeeper to catch
    return (
        f"Hello {target_brand}, we would leverage our synergy to invite you to our upcoming sneaker "
        f"event in Lagos. It will be a game-changer for your brand visibility. "
        f"Let us know if you want to collaborate."
    )


def call_gatekeeper_node(draft_text):
    """
    The Gatekeeper Node: Enforces brand voice and critical information standards.

    Rules:
      1. Required info: event date (december 12, 2026) + location (lagos)
      2. Zero tolerance for AI/corporate buzzwords
    """
    print("[Gatekeeper] Analyzing pitch compliance...")
    time.sleep(1)

    required_info    = ["december 12, 2026", "lagos"]
    banned_buzzwords = ["synergy", "leverage", "game-changer", "collaborate"]

    missing  = [info for info in required_info if info not in draft_text.lower()]
    buzzwords = [word for word in banned_buzzwords if word in draft_text.lower()]

    if missing:
        msg = f"REJECTED. Missing vital event data: {', '.join(missing)}."
        print(f"[Gatekeeper] [FAIL] {msg}")
        return False, "missing vital event data"

    if buzzwords:
        msg = f"REJECTED. Clean out the corporate fluff: {', '.join(buzzwords)}."
        print(f"[Gatekeeper] [FAIL] {msg}")
        return False, "corporate fluff detected"

    print("[Gatekeeper] [PASS] Voice is clean, direct, and accurate.")
    return True, "Passed."


def run_outreach_loop(brand_name):
    """
    Core reactivation loop: Draft → Verify → Adjust → Finalize.
    Mirrors the CRM Automation Framework on the website:
      identify dormant prospect → outreach sequence → loop back → convert.
    """
    print(f"--- RUNNING SNEAKER FEST OUTREACH ENGINE FOR: {brand_name} ---")

    max_iterations = 3
    feedback       = ""
    is_compliant   = False
    final_pitch    = ""

    for step in range(1, max_iterations + 1):
        print(f"\n--- Cycle {step} ---")

        draft = call_copywriter_node(brand_name, feedback)
        print(f'Generated Draft:\n"{draft}"')

        is_compliant, feedback = call_gatekeeper_node(draft)

        if is_compliant:
            final_pitch = draft
            break

        print("Feeding errors back into the loop. Re-generating...")

    if is_compliant:
        print("\n=== APPROVED SNEAKER FEST OUTREACH PITCH ===")
        print(final_pitch)
        print("============================================")
    else:
        print(
            "\n[System Alert] Loop timed out without passing brand standards. "
            "Manual override required."
        )


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "Premium Apparel Brand"
    run_outreach_loop(target)
