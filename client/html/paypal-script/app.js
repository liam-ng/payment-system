async function createProduct() {
  console.log("clicked!");
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify(
        {
          "name": "Basic Plan",
          "type": "SERVICE",
          "description": "Basic plan for standard features. 7-day trial. Charged begins 7 days after setting up subscription. Charged monthly.",
          "category": "ECOMMERCE_SERVICES"
        }
      )
    });
    console.log("sent request /api/products");

    const productData = await response.json();
    const productID = productData.id;
    console.log("product Data:", productID, "received reponse:", response.status);

    if (productID) {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "product_id": `${productID}`,
          }
        )
      });
      console.log("sent request /api/plans");
      resultMessage(`Redirecting for PayPal Checkout... click <a href=\"paypal-form.html\">here</a> if no response`);

      const planData = await response.json();
      console.log("plan ID:", planData.id, "received reponse:", response.status);

      if (planData.id) {
        console.log("Redirecting for PayPal Checkout...");
        fetch("/redirect", { method: 'GET', redirect: 'follow' })
          .then(response => {
            if (response.redirected) {
              window.location.href = response.url+'?planID='+planData.id;
            }
          })
          .catch(error => {
            console.error("Error during redirection:", error);
          });
      }

    } else {
      const errorDetail = productData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${productData.debug_id})`
        : JSON.stringify(productData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
  }
}

// async function onApprove(data, actions) {
//   try {
//     const response = await fetch(`/api/products/${data.orderID}/capture`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const productData = await response.json();
//     // Three cases to handle:
//     //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
//     //   (2) Other non-recoverable errors -> Show a failure message
//     //   (3) Successful transaction -> Show confirmation or thank you message

//     const errorDetail = productData?.details?.[0];

//     if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
//       // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
//       // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
//       return actions.restart();
//     } else if (errorDetail) {
//       // (2) Other non-recoverable errors -> Show a failure message
//       throw new Error(`${errorDetail.description} (${productData.debug_id})`);
//     } else if (!productData.purchase_units) {
//       throw new Error(JSON.stringify(productData));
//     } else {
//       // (3) Successful transaction -> Show confirmation or thank you message
//       // Or go to another URL:  actions.redirect('thank_you.html');
//       const transaction =
//         productData?.purchase_units?.[0]?.payments?.captures?.[0] ||
//         productData?.purchase_units?.[0]?.payments?.authorizations?.[0];
//       resultMessage(
//         `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
//       );
//       console.log(
//         "Capture result",
//         productData,
//         JSON.stringify(productData, null, 2),
//       );
//     }

//   } catch (error) {
//     console.error(error);
//     resultMessage(
//       `Sorry, your transaction could not be processed...<br><br>${error}`,
//     );
//   }
// }

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}