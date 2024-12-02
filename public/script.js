document.addEventListener('DOMContentLoaded', () => {
  const tripForm = document.getElementById('trip-form');
  const tripsContainer = document.getElementById('trips-container');

  // Fetch and display all trips
  const fetchTrips = async () => {
    const response = await fetch('http://localhost:3001/trips');
    const trips = await response.json();
    tripsContainer.innerHTML = '';
    trips.forEach(trip => {
      console.log(trip.tripName);
      const tripElement = document.createElement('div');
      tripElement.className = 'col-md-4';
      tripElement.innerHTML = `
        <div class="card">
          <div class="card-body" onClick="editTrip('${trip._id}')" style="cursor:pointer;">
            <h5 class="card-title">${trip.tripName}</h5>
            <p class="card-text">Start Date: ${new Date(trip.startDate).toLocaleDateString()}</p>
            <p class="card-text">End Date: ${new Date(trip.endDate).toLocaleDateString()}</p>
            <button class="btn btn-danger" onclick="deleteTrip('${trip._id}')">Delete</button>
          </div>
        </div>
      `;
      tripsContainer.appendChild(tripElement);
    });
  };

  // Handle form submission for creating a new trip
  tripForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const tripData = new FormData(tripForm);
    await fetch('http://localhost:3001/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(tripData.entries()))
    });
    tripForm.reset();
    fetchTrips();
  });

  // Edit a trip
  window.editTrip = async (id) => {
    const tripName = prompt('Enter new trip name:');
    const startDate = prompt('Enter new start date (YYYY-MM-DD):');
    const endDate = prompt('Enter new end date (YYYY-MM-DD):');
    if (tripName && startDate && endDate) {
      await fetch(`http://localhost:3001/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripName, startDate, endDate })
      });
      fetchTrips();
    }
  };

  // Delete a trip
  window.deleteTrip = async (id) => {
    await fetch(`http://localhost:3001/trips/${id}`, {
      method: 'DELETE'
    });
    fetchTrips();
  };

  // Initial fetch of trips
  fetchTrips();
});