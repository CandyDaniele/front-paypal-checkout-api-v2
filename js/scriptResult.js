let query = new URLSearchParams(location.search);
let namePayer = query.get('name');
let id = query.get('id');

pMessage = document.getElementById('message');
ptransactionId = document.getElementById('transactionId');

pMessage.innerText += " " + namePayer;
ptransactionId.innerText += " " + id;