const renderEC = () => {
    paypal.Buttons({
        createOrder: function () {
          conteudoJson = {
            total: (document.getElementById("calculated_total").innerText).substring(1),
            subtotal: (document.getElementById("sub_price").innerText).substring(1),
            shipping: (document.getElementById("sub_ship").innerText).substring(1),
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            line1: document.getElementById("address2").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            phone: document.getElementById("telephone").value,
            postal_code: document.getElementById("zip").value,
            country_code: document.getElementById("country").value,
            email: document.getElementById("email-address").value
          }
      
          console.log(conteudoJson);

                return fetch('https://paypal-checkout-api-v2.herokuapp.com/my-api/create-payment/', {
                  method: 'post',
                  credentials: "include",
                  body: JSON.stringify(conteudoJson),
                  headers: {
                    "Content-Type": "application/json"
                    
                  },
                }
              )
                .then(function (res) {
                  return res.json();
                }).then(function(data){
                  console.log(data);
                  return data.id;
                });
        },

        onApprove: function (data) {
                console.log(data);

                return fetch('https://paypal-checkout-api-v2.herokuapp.com/my-api/execute-payment/', {
                  method: 'post',
                  credentials: "include",
                  body: JSON.stringify({
                    orderID: data.orderID
                  }),
                  headers: {
                    "Content-Type": "application/json"
                    
                  },
                }
              )
                .then(function (res) {
                  return res.json();
                }).then(function(details){
                  console.log(details);
                  window.location = `result.html?name=${details.payer.name.given_name}&id=${details.purchase_units[0].payments.captures[0].id}`;
                });
        },
        
        style: {
          shape:  'rect',
          size: 'medium'
      }
    }).render('#paypal-button-container');
}

const renderValue = () => {
  //render Subtotal
  let priceInput = document.getElementById("priceInput");
  priceInput.addEventListener("keyup", (e) => {
    let inputSubtotal = priceInput.value
    if(isNaN(inputSubtotal) || inputSubtotal == ""){
      inputSubtotal = "145";
      priceInput.placeholder = "145.00";

    }


    let freteRadio = document.getElementsByName('shipping'); 
    let frete = 0;
              
    for(i = 0; i < freteRadio.length; i++) { 
        if(freteRadio[i].checked) {
          frete = freteRadio[i].value; 
        }
    }


    totalPedido = parseFloat(inputSubtotal) + parseFloat(frete);
    document.getElementById("sub_price").innerText = `$${parseFloat(inputSubtotal).toFixed(2)}`;
    document.getElementById("calculated_total").innerText = `$${(totalPedido.toFixed(2))}`;

  })

  //render Frete
  if (document.querySelector('input[name="shipping"]')) {
    document.querySelectorAll('input[name="shipping"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        let frete = parseFloat(event.target.value);
        let subtotal = parseFloat(document.getElementById("priceInput").value);
        if (isNaN(subtotal)){
          subtotal = 145;
        }

        let totalPedido = frete+subtotal;
        document.getElementById("sub_ship").innerText = `$${frete.toFixed(2)}`;
        document.getElementById("calculated_total").innerText = `$${(totalPedido.toFixed(2))}`;
      });
    });
  }


  
}

window.addEventListener("load", () => {

    renderEC();

    renderValue();

})