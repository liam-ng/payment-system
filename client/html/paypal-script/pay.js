const searchParams = new URLSearchParams(window.location.search);
// const planID = searchParams.get('planID');
$('input[name=planID]').val(searchParams.get('planID'));
console.log($('input[name=planID]').val);

// async function createSubscription() {
//   $('form#paypal-form').submit(); 

//   try {
//     const response = await fetch("/api/subscriptions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // use the "body" param to optionally pass additional order information
//       // like product ids and quantities
//       body: JSON.stringify(
//         {
//           "name": "Basic Plan",
//           "type": "SERVICE",
//           "description": "Basic plan for standard features. 7-day trial. Charged begins 7 days after setting up subscription. Charged monthly.",
//           "category": "ECOMMERCE_SERVICES"
//         }
//       )
//     });
//     console.log("sent request /api/products");

//     const productData = await response.json();
//     const productID = productData.id;
//     console.log("product Data:", productID, "received reponse:", response.status);

//   } catch (error) {
//     console.error(error);
//     resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
//   }
// }

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}
