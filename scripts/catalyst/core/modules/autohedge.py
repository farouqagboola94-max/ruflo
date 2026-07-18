"""
CatalystOS Module: AutoHedge
Source: The-Swarm-Corporation/AutoHedge
Multi-agent AI hedge fund — Director, Analyst, Executor agents
Adapted for CatalystOS by The Catalyst
"""

import json
import datetime
import urllib.request
import urllib.parse


class AutoHedgeDirector:
    """Director agent — sets strategy and allocates research tasks."""
    
    def __init__(self, portfolio_size_usd=10000, risk_level="moderate"):
        self.portfolio_size = portfolio_size_usd
        self.risk_level = risk_level  # conservative | moderate | aggressive
        self.strategy = None

    def set_strategy(self, market_context: str) -> dict:
        """Given market context, define fund strategy."""
        risk_params = {
            "conservative": {"max_position_pct": 0.05, "stop_loss": 0.03, "sectors": ["utilities", "healthcare", "bonds"]},
            "moderate":     {"max_position_pct": 0.10, "stop_loss": 0.05, "sectors": ["tech", "consumer", "financials"]},
            "aggressive":   {"max_position_pct": 0.20, "stop_loss": 0.10, "sectors": ["growth", "crypto", "emerging"]},
        }
        params = risk_params.get(self.risk_level, risk_params["moderate"])
        self.strategy = {
            "timestamp": datetime.datetime.now().isoformat(),
            "portfolio_size": self.portfolio_size,
            "risk_level": self.risk_level,
            "max_position_pct": params["max_position_pct"],
            "stop_loss_pct": params["stop_loss"],
            "target_sectors": params["sectors"],
            "market_context": market_context,
            "directive": f"Allocate up to {params['max_position_pct']*100}% per position. Stop loss at {params['stop_loss']*100}%.",
        }
        return self.strategy


class AutoHedgeAnalyst:
    """Analyst agent — researches stocks and generates trade signals."""

    MOCK_DATA = {
        "AAPL": {"price": 213.45, "pe": 28.2, "sentiment": 0.72, "momentum": "bullish"},
        "MSFT": {"price": 422.10, "pe": 35.1, "sentiment": 0.81, "momentum": "bullish"},
        "NVDA": {"price": 875.30, "pe": 48.7, "sentiment": 0.65, "momentum": "neutral"},
        "TSLA": {"price": 172.60, "pe": 52.3, "sentiment": 0.38, "momentum": "bearish"},
        "GOOGL": {"price": 178.90, "pe": 24.6, "sentiment": 0.69, "momentum": "bullish"},
        "META":  {"price": 524.70, "pe": 27.4, "sentiment": 0.75, "momentum": "bullish"},
        "AMZN": {"price": 196.30, "pe": 43.1, "sentiment": 0.70, "momentum": "neutral"},
    }

    def analyze(self, ticker: str, strategy: dict) -> dict:
        data = self.MOCK_DATA.get(ticker.upper(), {
            "price": 100.00, "pe": 20.0, "sentiment": 0.50, "momentum": "neutral"
        })
        score = (data["sentiment"] * 40) + ({"bullish": 30, "neutral": 15, "bearish": 0}.get(data["momentum"], 15))
        if data["pe"] < 30:
            score += 20
        signal = "BUY" if score >= 70 else ("HOLD" if score >= 40 else "SELL")
        position_size = round(strategy.get("portfolio_size", 10000) * strategy.get("max_position_pct", 0.10), 2) if signal == "BUY" else 0
        return {
            "ticker": ticker.upper(),
            "current_price": data["price"],
            "pe_ratio": data["pe"],
            "sentiment_score": data["sentiment"],
            "momentum": data["momentum"],
            "composite_score": round(score, 1),
            "signal": signal,
            "recommended_position_usd": position_size,
            "shares": round(position_size / data["price"], 2) if position_size > 0 else 0,
            "stop_loss_price": round(data["price"] * (1 - strategy.get("stop_loss_pct", 0.05)), 2),
            "rationale": f"Score {score:.0f}/100. Sentiment {data['sentiment']:.0%}, momentum {data['momentum']}, P/E {data['pe']}.",
        }


class AutoHedgeExecutor:
    """Executor agent — manages trade queue and generates PDF-style reports."""

    def __init__(self):
        self.trade_log = []

    def queue_trade(self, analysis: dict, dry_run: bool = True) -> dict:
        trade = {
            "id": f"TRD-{len(self.trade_log)+1:04d}",
            "timestamp": datetime.datetime.now().isoformat(),
            "ticker": analysis["ticker"],
            "action": analysis["signal"],
            "price": analysis["current_price"],
            "position_usd": analysis["recommended_position_usd"],
            "shares": analysis["shares"],
            "stop_loss": analysis["stop_loss_price"],
            "status": "PAPER" if dry_run else "LIVE",
            "rationale": analysis["rationale"],
        }
        self.trade_log.append(trade)
        return trade

    def generate_report(self, strategy: dict) -> str:
        lines = [
            "=" * 60,
            "AUTOHEDGE FUND REPORT — CATALYSTOS",
            f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "=" * 60,
            f"Portfolio Size: ${strategy.get('portfolio_size', 0):,.2f}",
            f"Risk Level: {strategy.get('risk_level', 'N/A').upper()}",
            f"Max Position: {strategy.get('max_position_pct', 0)*100:.0f}%",
            f"Stop Loss: {strategy.get('stop_loss_pct', 0)*100:.0f}%",
            "",
            "TRADE QUEUE:",
            "-" * 60,
        ]
        total_deployed = 0
        for t in self.trade_log:
            lines.append(f"[{t['id']}] {t['action']:4s} {t['ticker']:6s} @ ${t['price']:,.2f} | ${t['position_usd']:,.2f} | {t['shares']} shares | SL: ${t['stop_loss']:,.2f} | {t['status']}")
            total_deployed += t["position_usd"]
        lines += [
            "-" * 60,
            f"Total Deployed: ${total_deployed:,.2f}",
            f"Cash Reserved: ${strategy.get('portfolio_size', 0) - total_deployed:,.2f}",
            "=" * 60,
            "DISCLAIMER: Paper trading only. Not financial advice.",
        ]
        return "\n".join(lines)


class AutoHedge:
    """Full AutoHedge multi-agent fund — CatalystOS integration."""

    def __init__(self, portfolio_size=10000, risk_level="moderate"):
        self.director = AutoHedgeDirector(portfolio_size, risk_level)
        self.analyst = AutoHedgeAnalyst()
        self.executor = AutoHedgeExecutor()

    def run(self, tickers: list, market_context: str = "Mixed signals. Tech sector leading.", dry_run: bool = True) -> dict:
        strategy = self.director.set_strategy(market_context)
        analyses = [self.analyst.analyze(t, strategy) for t in tickers]
        trades = [self.executor.queue_trade(a, dry_run) for a in analyses if a["signal"] != "HOLD"]
        report = self.executor.generate_report(strategy)
        return {
            "strategy": strategy,
            "analyses": analyses,
            "trades": trades,
            "report": report,
        }


if __name__ == "__main__":
    fund = AutoHedge(portfolio_size=50000, risk_level="moderate")
    result = fund.run(
        tickers=["AAPL", "MSFT", "NVDA", "TSLA", "META"],
        market_context="Q2 2026. Fed holding rates. Tech earnings strong. Inflation cooling.",
    )
    print(result["report"])
    print(f"\n✅ {len(result['trades'])} trades queued | {len(result['analyses'])} stocks analyzed")
