const serverAddress = '/*SERVER-ADDRESS*/';

function onLogin() {
  const userNameValue = document.getElementById('userName').value;
  const dropdownElement = document.getElementById('attendeeSelect');
  const userDropdownValue =  dropdownElement.options[dropdownElement.selectedIndex].text;
  
  const userName = userDropdownValue !== '-- Select your name --' ? userDropdownValue : userNameValue;
  // alert(`Name: ${userNameValue}\nDropdown: ${userDropdownValue}`);
  if (userName === '') {
    alert('Please enter your name or select it from the dropdown to continue!');
    return;
  }

  window.location = `http://${serverAddress}:8080/food/account?attendeeName=${userName}`;
}

function onAccountSubmit() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventNames = /*EVENT-NAMES*/;
  const attendeeName = urlParams.get('attendeeName');
  
  const entreeData = [];
  for (let i = 0, count = eventNames.length; i < count; i += 1) {
    const inputFieldValue = document.getElementById(eventNames[i]).value;

    if (inputFieldValue === '') {
      continue;
    }

    const entree = {
      eventIndex: i,
      content: inputFieldValue
    }
    entreeData.push(entree);
  }
  
  // alert("Submit " + attendeeName + "\n" + JSON.stringify(entreeData));
  const bodyData = {
    attendeeName: attendeeName,
    entreeData: entreeData
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/food/setAttendeeData`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bodyData)
    }
  );

  fetch(request)
    .then()
    .then(() => {
      alert('Meals info saved successfully!');
      window.location = `http://${serverAddress}:8080/food`;
      // location.reload();
    });
}

function onLoginPressed() {
  window.location = `http://${serverAddress}:8080/food/login`;
}