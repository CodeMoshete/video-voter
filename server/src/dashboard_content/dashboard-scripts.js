/* eslint-disable no-unused-vars */
function submitGuestbookEntry() {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const clientAddress = '/*CLIENT-ADDRESS*/';
  const amountValue = document.getElementById('amountField').value;
  console.log(`Log feeding amount: ${amountValue}`);

  const bodyData = {
    amount: amountValue
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/video-voting/logFeeding`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bodyData, null, 2)
    }
  );

  fetch(request)
    .then()
    .then(() => {
      document.getElementById('amountField').value = '';
      location.reload();
    });
}
