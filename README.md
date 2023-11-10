a Minimum Viable Product for demonstrating API calls between client, server, and PayPal. API-first approach was adopted. During development, GitHub Actions was used to build and deploy staging environment to Azure App Service and perform SAST scan using Semgrep against OWASP Top 10 and SAN CWE Top 25. 

Features:
- Accept PayPal and credit card payments.
- 7-day trial period, after which automatic billing begins.
- Users can terminate service any time (through PayPal portal).

Link to demo (may take 30 seconds to load, hosted on free tire App Service):
https://liam-demo.azurewebsites.net/
