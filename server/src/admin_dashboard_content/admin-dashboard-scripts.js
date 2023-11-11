/* eslint-disable no-unused-vars */
function deleteEntry(timestamp) {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const bodyData = {
    timestamp
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/video-voting/removeEntry`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bodyData, null, 2)
    }
  );

  fetch(request)
    .then()
    .then(() => {
      console.log('Success');
      location.reload(false);
    });
}
