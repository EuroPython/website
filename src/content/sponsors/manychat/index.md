---
name: "Manychat"
url: "https://careers.manychat.com/"
industry: "Technology & Marketing"
description:
  "We build AI-powered chat automation for 1M+ creators and brands at real
  production scale."
socials:
  linkedin: "https://www.linkedin.com/company/manychat"
  twitter: "https://x.com/Manychat_life"
  blog: "https://medium.com/manychat-engineering"
  github:
  discord:
  youtube: "https://www.youtube.com/@manychat-engineering/"
  instagram: "https://www.instagram.com/manychat_life/"
tier: Platinum
logo_padding: 20px 10px
---

# About Manychat

**We’re [Manychat](https://manychat.com/)! 👋🏻 Chat automation for 1M+ businesses
at massive scale, with Python infrastructure that actually handles it without
headaches.**

Bet you know this feeling all too well: deploying an LLM feature and HOPING for
the best in production 🤞🏻

The costs, rate limits, provider outages taking down your entire feature… it
used to haunt us, but we developed the systems that can handle it all.

We power chat automation for over a million creators and brands, so "the LLM is
down" isn't an acceptable answer, ever. We built infrastructure that expects
LLMs to misbehave:

- Multi-provider routing that fails over from Azure to OpenAI mid-retry.
- Weighted traffic distribution that we can rebalance without deploying code.
- Cooldowns that pull failing backends out of rotation automatically.
- Observability that actually helps — Prometheus metrics, Grafana dashboards,
  OpenTelemetry traces with business context so we know which customer's request
  just broke.

We also monitor our asyncio event loop like hawks, because nothing ruins your
day faster than discovering a blocking call is starving your entire service.

**And we'd love to discuss this and all things Python with like-minded people!**
Come by our booth to talk to the engineers who built this infrastructure. We can
tell you how we handle rate-limit cascades. How we track token costs per AI
agent. What it's like to debug distributed traces when you're trying to figure
out why one specific request took 6 seconds instead of 2. And anything else
you'd like to know about working in such a high-load environment.

Come see us on stage:

- Daria Korsakova, Python Engineer at Manychat will talk about Practical
  observability for Python APIs, workers & jobs
- Sergi Porta, Python Team Lead at Manychat will talk about LLM Traffic Spikes:
  Routing, Rate Limits, and Failover in Python

Read the full technical breakdown of our infrastructure:
https://medium.com/manychat-engineering/how-to-survive-llm-traffic-spikes-in-python-73955ee9426f

Meet our engineering team: https://careers.manychat.com/team/engineering

Explore open roles: https://careers.manychat.com/positions
