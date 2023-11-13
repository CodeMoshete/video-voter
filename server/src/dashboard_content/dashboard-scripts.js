/* eslint-disable no-unused-vars */
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

function setCookie(value) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 14);

  const cookie = `userName=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookie;
}

function getCookie() {
  const cookies = document.cookie.split(';');
  const name = 'userName';
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Return null if the cookie is not found
}

function setUserName() {
  const name = document.getElementById('nameField').value;
  if (name !== '' && name !== 'Your Name...') {
    setCookie(name);

    // Replace 'parentElementId' with the actual ID of the parent element
    const parentElement = document.getElementById('nameContainer');

    // Get a reference to the div element with the ID 'nameDiv'
    const divToRemove = document.getElementById('nameDiv');

    // Check if the element with the ID 'nameDiv' exists before attempting to remove it
    if (divToRemove) {
      // Remove the div element from its parent
      parentElement.removeChild(divToRemove);
    } else {
      console.error("Element with ID 'nameDiv' not found");
    }
  }
}

function createEnterNamePrompt() {
  // Assuming you have a reference to the parent element with the id "nameContainer"
  const nameContainer = document.getElementById('nameContainer');

  // Create a div element
  const divElement = document.createElement('div');
  divElement.className = 'inputContainer';
  divElement.id = 'nameDiv';

  // Create a span element with the class "border2" and text content
  const spanElement = document.createElement('span');
  spanElement.className = 'border2';
  spanElement.textContent = 'Please enter your name:';

  // Create an input element with type "text", id "nameField", and placeholder
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.id = 'nameField';
  inputElement.placeholder = 'Your Name...';

  // Create a button element with the class "nameBtn", text content, and onclick attribute
  const buttonElement = document.createElement('button');
  buttonElement.className = 'nameBtn';
  buttonElement.textContent = 'Submit';
  buttonElement.onclick = setUserName;

  // Append the created elements to the div element
  divElement.appendChild(spanElement);
  divElement.appendChild(inputElement);
  divElement.appendChild(buttonElement);

  // Append the div element to the "nameContainer"
  nameContainer.appendChild(divElement);
}

function submitVote(score) {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const name = getCookie();
  const video = document.getElementById('videoName').textContent;

  if (name === null || name === 'Your Name...') {
    alert('Please set your name before voting!');
    return;
  }

  console.log(`Log vote for user ${name}: ${score}`);

  const bodyData = {
    vote: score,
    userName: name,
    videoName: video
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/video-voting/logVote`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bodyData)
    }
  );

  fetch(request)
    .then()
    .then(() => {
      alert(`Vote cast: ${score}`);
      // document.getElementById('amountField').value = '';
      // location.reload();
    });
}

function onPageLoaded() {
  const userName = getCookie();
  if (userName === null) {
    console.log('Username is null.');
    createEnterNamePrompt();
  } else {
    console.log(`Username is ${userName}`);
  }
}

document.addEventListener('DOMContentLoaded', onPageLoaded);
