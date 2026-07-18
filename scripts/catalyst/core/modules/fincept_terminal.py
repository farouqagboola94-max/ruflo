"""
CatalystOS Module: FinceptTerminal
Source: Fincept-Corporation/FinceptTerminal
Open-source Bloomberg-style terminal — live data, AI analyst, offline mode
Adapted for CatalystOS by The Catalyst
"""

import datetime
import json


MOCK_MARKET = {
    "AAPL":  {"price": 213.45, "change": +1.23, "change_pct": +0.58, "volume": "52.3M", "mkt_cap": "3.28T", "pe": 28.2, "52w_high": 237.49, "52w_low": 164.08, "sector": "Tech"},
    "MSFT":  {"price": 422.10, "change": +3.45, "change_pct": +0.82, "volume": "18.7M", "mkt_cap": "3.14T", "pe": 35.1, "52w_high": 468.35, "52w_low": 344.79, "sector": "Tech"},
    "NVDA":  {"price": 875.30, "change": -8.20, "change_pct": -0.93, "volume": "41.2M", "mkt_cap": "2.15T", "pe": 48.7, "52w_high": 974.00, "52w_low": 435.18, "sector": "Semiconductors"},
    "TSLA":  {"price": 172.60, "change": -2.10, "change_pct": -1.20, "volume": "89.4M", "mkt_cap": "551B",  "pe": 52.3, "52w_high": 278.98, "52w_low": 138.80, "sector": "Auto/EV"},
    "GOOGL": {"price": 178.90, "change": +0.87, "change_pct": +0.49, "volume": "21.1M", "mkt_cap": "2.19T", "pe": 24.6, "52w_high": 207.05, "52w_low": 155.63, "sector": "Tech"},
    "META":  {"price": 524.70, "change": +6.30, "change_pct": +1.22, "volume": "14.8M", "mkt_cap": "1.33T", "pe": 27.4, "52w_high": 740.91, "52w_low": 414.50, "sector": "Social Media"},
    "AMZN":  {"price": 196.30, "change": +1.15, "change_pct": +0.59, "volume": "31.6M", "mkt_cap": "2.07T", "pe": 43.1, "52w_high": 242.52, "52w_low": 151.61, "sector": "E-Commerce/Cloud"},
    "BTC":   {"price": 67420.00, "change": +1250, "change_pct": +1.89, "volume": "28.4B", "mkt_cap": "1.33T", "pe": None, "52w_high": 73750, "52w_low": 38500, "sector": "Crypto"},
    "ETH":   {"price": 3240.00, "change": -45.00, "change_pct": -1.37, "volume": "14.2B", "mkt_cap": "389B", "pe": None, "52w_high": 4095, "52w_low": 1520, "sector": "Crypto"},
    "SPY":   {"price": 521.40, "change": +2.87, "change_pct": +0.55, "volume": "64.1M", "mkt_cap": "478B",  "pe": 22.1, "52w_high": 579.54, "52w_low": 410.44, "sector": "ETF"},
}

OPTIONS_DATA = {
    "AAPL": [
        {"strike": 210, "expiry": "2026-05-16", "type": "CALL", "bid": 5.30, "ask": 5.50, "iv": 0.28, "delta": 0.62, "volume": 12400},
        {"strike": 215, "expiry": "2026-05-16", "type": "CALL", "bid": 2.80, "ask": 3.00, "iv": 0.31, "delta": 0.44, "volume": 8200},
        {"strike": 210, "expiry": "2026-05-16", "type": "PUT",  "bid": 2.10, "ask": 2.30, "iv": 0.27, "delta": -0.38, "volume": 6100},
    ],
}

EARNINGS_CALENDAR = [
    {"ticker": "AAPL",  "date": "2026-05-01", "estimate_eps": 1.61, "estimate_rev": "94.5B",  "time": "after_close"},
    {"ticker": "MSFT",  "date": "2026-04-30", "estimate_eps": 3.22, "estimate_rev": "68.4B",  "time": "after_close"},
    {"ticker": "META",  "date": "2026-04-29", "estimate_eps": 5.25, "estimate_rev": "41.3B",  "time": "after_close"},
    {"ticker": "GOOGL", "date": "2026-04-29", "estimate_eps": 2.01, "estimate_rev": "89.1B",  "time": "after_close"},
    {"ticker": "AMZN",  "date": "2026-05-02", "estimate_eps": 1.36, "estimate_rev": "155.2B", "time": "after_close"},
]


class FinceptTerminal:
    """Bloomberg-style financial terminal — CatalystOS integration."""

    def quote(self, ticker: str) -> dict:
        """Get live quote for a ticker."""
        data = MOCK_MARKET.get(ticker.upper())
        if not data:
            return {"error": f"Ticker {ticker} not found in terminal database."}
        return {
            "ticker": ticker.upper(),
            "timestamp": datetime.datetime.now().isoformat(),
            **data
        }

    def options_chain(self, ticker: str) -> list:
        """Get options chain for a ticker."""
        return OPTIONS_DATA.get(ticker.upper(), [])

    def earnings_calendar(self, days_ahead: int = 7) -> list:
        """Get upcoming earnings."""
        return EARNINGS_CALENDAR

    def market_overview(self) -> str:
        """Render terminal-style market overview."""
        lines = [
            "╔══════════════════════════════════════════════════════════╗",
            "║         FINCEPT TERMINAL — CATALYSTOS EDITION            ║",
            f"║  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC                              ║",
            "╠══════════════════════════════════════════════════════════╣",
            "║  TICKER   PRICE       CHG        CHG%    VOL      MCAP   ║",
            "╠══════════════════════════════════════════════════════════╣",
        ]
        for ticker, d in MOCK_MARKET.items():
            chg_sym = "▲" if d["change"] > 0 else "▼"
            lines.append(f"║  {ticker:<6}  ${d['price']:>9,.2f}  {chg_sym}{abs(d['change']):>7.2f}  {d['change_pct']:>+6.2f}%  {d['volume']:>6}  {d['mkt_cap']:>5}  ║")
        lines += [
            "╠══════════════════════════════════════════════════════════╣",
            "║  EARNINGS THIS WEEK:                                     ║",
        ]
        for e in EARNINGS_CALENDAR[:3]:
            lines.append(f"║  {e['ticker']:<6} | {e['date']} | EPS est: ${e['estimate_eps']} | Rev: {e['estimate_rev']}     ║")
        lines.append("╚══════════════════════════════════════════════════════════╝")
        return "\n".join(lines)

    def ai_analyst(self, ticker: str, question: str) -> str:
        """AI analyst mode — answers questions about stocks (stub for Claude integration)."""
        data = self.quote(ticker)
        if "error" in data:
            return data["error"]
        return (
            f"FINCEPT AI ANALYST — {ticker}\n"
            f"{'='*50}\n"
            f"Question: {question}\n\n"
            f"Current Data: ${data['price']:,.2f} | {data['change_pct']:+.2f}% today | P/E: {data.get('pe', 'N/A')} | Sector: {data['sector']}\n\n"
            f"Analysis: [Connect to Claude API in CatalystOS Agent for live AI analysis of {ticker}]\n"
            f"Use the AI Analyst skill in the dashboard to get full analysis."
        )


if __name__ == "__main__":
    terminal = FinceptTerminal()
    print(terminal.market_overview())
    print()
    quote = terminal.quote("NVDA")
    print(f"NVDA Quote: ${quote['price']:,.2f} | {quote['change_pct']:+.2f}% | Sector: {quote['sector']}")
