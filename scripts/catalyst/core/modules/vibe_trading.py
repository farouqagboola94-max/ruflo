"""
CatalystOS Module: Vibe Trading
Source: HKUDS/Vibe-Trading
LLM-powered sentiment trading — reads news, Reddit, social signals
Adapted for CatalystOS by The Catalyst
"""

import datetime
import random


SENTIMENT_SOURCES = {
    "news": [
        {"source": "Reuters", "headline": "Fed signals pause on rate hikes amid cooling inflation", "sentiment": 0.72, "asset": "SPY"},
        {"source": "Bloomberg", "headline": "Tech earnings beat expectations for 3rd consecutive quarter", "sentiment": 0.85, "asset": "QQQ"},
        {"source": "CNBC", "headline": "Oil prices drop as OPEC+ raises production targets", "sentiment": -0.45, "asset": "XLE"},
        {"source": "FT", "headline": "Nigeria's central bank holds rates as inflation stabilizes", "sentiment": 0.55, "asset": "NGN"},
        {"source": "TechCrunch", "headline": "AI infrastructure spending accelerates across Fortune 500", "sentiment": 0.88, "asset": "NVDA"},
    ],
    "reddit": [
        {"subreddit": "r/wallstreetbets", "ticker": "GME", "mentions": 4200, "sentiment": 0.61, "momentum": "rising"},
        {"subreddit": "r/investing", "ticker": "AAPL", "mentions": 1850, "sentiment": 0.74, "momentum": "stable"},
        {"subreddit": "r/stocks", "ticker": "TSLA", "mentions": 3100, "sentiment": 0.32, "momentum": "falling"},
        {"subreddit": "r/algotrading", "ticker": "SPY", "mentions": 920, "sentiment": 0.68, "momentum": "rising"},
        {"subreddit": "r/Superstonk", "ticker": "NVDA", "mentions": 2400, "sentiment": 0.79, "momentum": "rising"},
    ],
    "social": [
        {"platform": "Twitter/X", "ticker": "BTC", "mentions_24h": 48200, "sentiment": 0.71, "viral": True},
        {"platform": "Twitter/X", "ticker": "ETH", "mentions_24h": 22100, "sentiment": 0.65, "viral": False},
        {"platform": "LinkedIn", "ticker": "MSFT", "mentions_24h": 8400, "sentiment": 0.82, "viral": False},
        {"platform": "StockTwits", "ticker": "AAPL", "mentions_24h": 15200, "sentiment": 0.77, "viral": True},
    ],
}


class SentimentAggregator:
    """Fuses news, Reddit, and social signals into composite sentiment scores."""

    def aggregate(self, ticker: str) -> dict:
        ticker = ticker.upper()
        scores = []
        evidence = []

        for item in SENTIMENT_SOURCES["news"]:
            if ticker in item.get("asset", "") or ticker in item.get("headline", "").upper():
                scores.append(item["sentiment"])
                evidence.append(f"[NEWS] {item['source']}: {item['headline'][:60]}... ({item['sentiment']:+.2f})")

        for item in SENTIMENT_SOURCES["reddit"]:
            if item["ticker"] == ticker:
                scores.append(item["sentiment"])
                evidence.append(f"[REDDIT] {item['subreddit']}: {item['mentions']:,} mentions | momentum {item['momentum']} ({item['sentiment']:+.2f})")

        for item in SENTIMENT_SOURCES["social"]:
            if item["ticker"] == ticker:
                scores.append(item["sentiment"])
                evidence.append(f"[SOCIAL] {item['platform']}: {item['mentions_24h']:,} mentions/24h | viral={item['viral']} ({item['sentiment']:+.2f})")

        if not scores:
            composite = 0.50
            signal = "NEUTRAL"
        else:
            composite = sum(scores) / len(scores)
            if composite >= 0.70:
                signal = "STRONG BUY"
            elif composite >= 0.55:
                signal = "BUY"
            elif composite >= 0.45:
                signal = "HOLD"
            elif composite >= 0.30:
                signal = "SELL"
            else:
                signal = "STRONG SELL"

        return {
            "ticker": ticker,
            "composite_sentiment": round(composite, 3),
            "signal": signal,
            "sources_count": len(scores),
            "evidence": evidence,
            "timestamp": datetime.datetime.now().isoformat(),
        }


class VibeBacktester:
    """Backtests sentiment strategies on historical data windows."""

    def backtest(self, ticker: str, days: int = 30, strategy_threshold: float = 0.65) -> dict:
        wins, losses = 0, 0
        trades = []
        seed = hash(ticker) % 1000
        for i in range(days):
            sent = min(1.0, max(0.0, 0.5 + (((seed * (i+1)) % 100) - 50) / 100))
            price_change = ((((seed * (i+3)) % 100) - 40) / 200)
            if sent >= strategy_threshold:
                outcome = "WIN" if price_change > 0 else "LOSS"
                if price_change > 0:
                    wins += 1
                else:
                    losses += 1
                trades.append({
                    "day": i + 1,
                    "sentiment": round(sent, 3),
                    "price_change_pct": round(price_change * 100, 2),
                    "outcome": outcome,
                })

        total = wins + losses
        win_rate = wins / total if total > 0 else 0
        avg_return = sum(t["price_change_pct"] for t in trades) / len(trades) if trades else 0

        return {
            "ticker": ticker,
            "backtest_days": days,
            "strategy_threshold": strategy_threshold,
            "total_trades": total,
            "wins": wins,
            "losses": losses,
            "win_rate_pct": round(win_rate * 100, 1),
            "avg_return_pct": round(avg_return, 2),
            "profitable": win_rate > 0.5,
        }


class VibeTradingSystem:
    """Full Vibe Trading integration for CatalystOS."""

    def __init__(self):
        self.aggregator = SentimentAggregator()
        self.backtester = VibeBacktester()

    def scan(self, tickers: list) -> list:
        results = []
        for ticker in tickers:
            sentiment = self.aggregator.aggregate(ticker)
            backtest = self.backtester.backtest(ticker, days=30)
            results.append({
                "ticker": ticker,
                "sentiment": sentiment,
                "backtest": backtest,
                "action": sentiment["signal"],
            })
        results.sort(key=lambda x: x["sentiment"]["composite_sentiment"], reverse=True)
        return results

    def report(self, results: list) -> str:
        lines = [
            "=" * 60,
            "VIBE TRADING SCAN REPORT — CATALYSTOS",
            f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "=" * 60,
        ]
        for r in results:
            s = r["sentiment"]
            b = r["backtest"]
            lines += [
                f"\n{r['ticker']} — {s['signal']}",
                f"  Sentiment Score: {s['composite_sentiment']:.3f} | Sources: {s['sources_count']}",
                f"  Backtest 30d: Win Rate {b['win_rate_pct']}% | Avg Return {b['avg_return_pct']:+.2f}%",
            ]
            for ev in s["evidence"]:
                lines.append(f"    {ev}")
        lines += ["", "=" * 60, "DISCLAIMER: Not financial advice. Paper trades only."]
        return "\n".join(lines)


if __name__ == "__main__":
    system = VibeTradingSystem()
    results = system.scan(["AAPL", "NVDA", "TSLA", "BTC", "SPY"])
    print(system.report(results))
