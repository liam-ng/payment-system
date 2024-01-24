# Overview
a website built on Node.js to demonstrate API calls between client, server, and PayPal. API-first approach was adopted. During development, GitHub Actions was used to build and deploy staging environment to Azure App Service and perform SAST scan using Semgrep against OWASP Top 10 and SAN CWE Top 25. 

Features:
- Accept PayPal and credit card payments.
- 7-day trial period, after which automatic billing begins.
- Users can terminate service any time (through PayPal portal).

Link to demo (may take 30 seconds to load, hosted on free tire App Service):
https://liam-demo.azurewebsites.net/

## API Flow
![image](https://github.com/liam-ng/payment-system/assets/90180576/86576aee-99b9-42e0-9ff7-012e12f42447)

Reference to PayPal Documentation

Expected Workflow
![image](https://github.com/liam-ng/payment-system/assets/90180576/74a5a73d-88f5-49e3-b461-ee883ceeb98b)

List of Variables in API Calls (Postman)

![image](https://github.com/liam-ng/payment-system/assets/90180576/1b607bfa-dd08-482a-96f8-dd17606d71ed)


## Result
### Web
![image](https://github.com/liam-ng/payment-system/assets/90180576/06fca593-ff10-47cf-8f47-e6f871ae5abd)
![image](https://github.com/liam-ng/payment-system/assets/90180576/dc9e28c4-839e-48c0-94ea-8cff3c1b676e)

### PayPal Dev Portal
![image](https://github.com/liam-ng/payment-system/assets/90180576/f5994c8b-a090-4d90-8b98-bc5a2427e6f1)

### SemGrep
![image](https://github.com/liam-ng/payment-system/assets/90180576/234331bc-d17c-419f-b492-60d518f9f5a8)
![image](https://github.com/liam-ng/payment-system/assets/90180576/427825b1-fd8a-42ed-a14e-944080491a7d)


## Potential Improvement
- System Design Diagram
- Input verification/ cleaning
- Error/ Exception Handling
- surprisingly GitHub SAST detected exposed credential but not SemGrep, the GitLab custom ruleset for Semgrep has great potential for comprehensive scanning 
