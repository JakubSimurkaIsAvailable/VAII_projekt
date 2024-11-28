document.addEventListener('DOMContentLoaded', () => {
    const tripForm = document.getElementById('trip-form');
    const destinationForm = document.getElementById('destination-form');
  
    tripForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const tripData = new FormData(tripForm);
      fetch('http://localhost:3000/api/trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(tripData.entries()))
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    });
  
    destinationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const destinationData = new FormData(destinationForm);
      fetch('http://localhost:3000/api/destination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(destinationData.entries()))
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    });
  });