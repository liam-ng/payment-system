// import express from "express";
// import fetch from "node-fetch";
// import cors from "cors";
// import "dotenv/config";

// Replace if using a different env file or config
const env = require('dotenv').config({ path: './server/node/.env' });
const { resolve } = require('path');

// PayPal
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 4242 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const express = require('express');
const app = express();

// host static files
app.use(express.static("client"));

// parse post params sent in body in json format
app.use(express.json());

// Parse URL-encoded bodies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// PayPal
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
  console.log(
    "AccessToken:",
    data.access_token,
  );
};

/**
 * Create an product to create a plan.
 */
const createProduct = async (product) => {
  // use the product information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping product information passed from the frontend createProduct() callback:",
    product,
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v1/catalogs/products`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      'Prefer': 'return=representation',
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(product),
  });

  return handleResponse(response);
};

/**
 * Create plan for the created order to complete the transaction.
 */
const createPlan = async (productID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/billing/plans`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    body: JSON.stringify({ "product_id": `${productID}`, "name": "Basic Plan", "description": "Basic plan for standard features. 7-day trial. Charged begins 7 days after setting up subscription. Charged monthly.", "status": "ACTIVE", "billing_cycles": [{ "frequency": { "interval_unit": "DAY", "interval_count": 7 }, "tenure_type": "TRIAL", "sequence": 1, "total_cycles": 1, "pricing_scheme": { "fixed_price": { "value": "0", "currency_code": "CAD" } } }, { "frequency": { "interval_unit": "MONTH", "interval_count": 1 }, "tenure_type": "REGULAR", "sequence": 2, "total_cycles": 12, "pricing_scheme": { "fixed_price": { "value": "9.99", "currency_code": "CAD" } } }], "payment_preferences": { "auto_bill_outstanding": true, "setup_fee": { "value": "0", "currency_code": "CAD" }, "setup_fee_failure_action": "CONTINUE", "payment_failure_threshold": 3 }, "taxes": { "percentage": "13", "inclusive": false } })
  });
  console.log(
    "Subscription Plan passed to the frontend from createPlan() callback:",
    response.body,
  );
  return handleResponse(response);
};

const createSubscription = async (formData) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/billing/subscriptions`;
  var d = new Date();
  d.setDate(d.getDate() + 1);
  let tomorrow = d.toISOString();
  var planID = formData.planID;
  var client_given_name = formData.client_given_name;
  var client_surname = formData.client_surname;
  var client_email_address = formData.client_email_address;
  var client_address_line_1 = formData.client_address_line_1;
  var client_address_line_2 = formData.client_address_line_2;
  var client_admin_area_2 = formData.client_admin_area_2;
  var client_admin_area_1 = formData.client_admin_area_1;
  var client_postal_code = formData.client_postal_code;
  var country_code = "CA";
  var brand_name = "Liam Example Inc";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    body: JSON.stringify(
      { "plan_id": `${planID}`, "start_time": `${tomorrow}`, "shipping_amount": { "currency_code": "CAD", "value": "0.00" }, "subscriber": { "name": { "given_name": `${client_given_name}`, "surname": `${client_surname}` }, "email_address": `${client_email_address}`, "shipping_address": { "name": { "full_name": `${client_given_name} `+`${client_surname}` }, "address": { "address_line_1": `${client_address_line_1}`, "address_line_2": `${client_address_line_2}`, "admin_area_2": `${client_admin_area_2}`, "admin_area_1": `${client_admin_area_1}`, "postal_code": `${client_postal_code}`, "country_code": `${country_code}` } } }, "application_context": { "brand_name": `${brand_name}`, "locale": "en-US", "shipping_preference": "SET_PROVIDED_ADDRESS", "user_action": "SUBSCRIBE_NOW", "payment_method": { "payer_selected": "PAYPAL", "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED" }, "return_url": "https://liam-demo.azurewebsites.net/return", "cancel_url": "https://liam-demo.azurewebsites.net/return" } }
    )
  });
  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/products", async (req, res) => {
  try {
    // use the product information passed from the front-end to calculate the order amount detals
    const product = req.body;
    const { jsonResponse, httpStatusCode } = await createProduct(product);
    console.log("createProduct response: ", httpStatusCode, "productID: ", jsonResponse.id)
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/plans", async (req, res) => {
  try {
    // use the product information passed from the front-end to calculate the order amount detals
    const productID = (req.body).product_id;
    const { jsonResponse, httpStatusCode } = await createPlan(productID);
    console.log("createProduct response: ", httpStatusCode, "planID: ", jsonResponse.id)
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create plan:", error);
    res.status(500).json({ error: "Failed to create plan." });
  }
});

app.use('/redirect', (req, res) => {
  console.log("redirecting to paypal form...");
  res.redirect(308, '/paypal-form.html');
});

app.use('/return', (req, res) => {
  console.log("redirecting to main page...");
  res.redirect(308, '/');
});

app.post("/api/subscriptions", async (req, res) => {
  try {
    // use the product information passed from the front-end to calculate the order amount detals
    console.log(req.body);
    const { jsonResponse, httpStatusCode } = await createSubscription(req.body);
    console.log("createSubscription response: ", httpStatusCode, "ref: ", jsonResponse);
    res.redirect(302, `${jsonResponse.links[0].href}`);
  } catch (error) {
    console.error("Failed to create subscription:", error);
    res.status(500).json({ error: "Failed to create subscription." });
  }
});

// serve index.html
app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(path);
});

app.listen(PORT, () =>
  console.log(`Node server listening at http://localhost:${PORT}`)
);