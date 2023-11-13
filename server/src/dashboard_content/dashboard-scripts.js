/* eslint-disable no-unused-vars */
function submitGuestbookEntry() {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const clientAddress = '/*CLIENT-ADDRESS*/';
  const name = document.getElementById('nameField').value;
  console.log(`Log feeding amount: ${amountValue}`);

  const bodyData = {
    // amount: amountValue
    userName: ''
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/video-voting/logVote`,
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

function checkStatus() {
  const serverAddress = '/*SERVER-ADDRESS*/';
  console.log('Status check');
  const myHeaders = new Headers();
  const request = new Request(
    `http://${serverAddress}:8080/video-voting/getCurrentVideoName`,
    {
      method: 'GET',
      headers: myHeaders
    }
  );

  fetch(request)
    .then((result) => result.text())
    .then((text) => {
      console.log(text);
      // document.getElementById('amountField').value = '';
      document.getElementById('videoName').textContent = text;
      // location.reload();
    });
  setTimeout(checkStatus, 10000);
}

checkStatus();

function setCookie(name, value, daysToExpire) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookie;
}

// Example usage
// setCookie('username', 'john_doe', 7); // Set a cookie named 'username' with the value 'john_doe' that expires in 7 days

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Return null if the cookie is not found
}

// Example usage
// const username = getCookie('username');
// console.log('Username:', username);