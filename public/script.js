document.addEventListener('DOMContentLoaded', () => {
  const tripForm = document.getElementById('trip-form');
  const tripsContainer = document.getElementById('trips-container');
  const updateTripButton = document.getElementById('update-trip');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const tripName = document.getElementById('tripName');
  let currentTripId = null;


  // Check if end date is after start date
  endDate.addEventListener('change', () => {
    if (startDate.value && endDate.value < startDate.value) {
        alert('End date must be after start date');
        endDate.value = '';
      }
      if(endDate.value < new Date().toISOString().split('T')[0]){
        alert('End date must be after today');
        endDate.value = '';
      }
    })
  //Check if start and end value is after today
  startDate.addEventListener('change', () => {
    if (endDate.value && endDate.value < startDate.value) {
      alert('End date must be after today');
      endDate.value = '';
    }
    if(startDate.value < new Date().toISOString().split('T')[0]){
      alert('Start date must be after today');
      startDate.value = '';
    }
  });
  //Check if trip name is valid
  tripName.addEventListener('change', () => {
    if(tripName.value.length < 3){
      alert('Trip name must be at least 3 characters');
      tripName.value = '';
    }
    if(tripName.value.length > 100){
      alert('Trip name must be less than 100 characters');
      tripName.value = '';
    }
    if(tripName.value[0] === ' '){
      alert('Trip name cannot start with a space');
      tripName.value = '';
    }
    if (!/^[a-zA-Z]/.test(tripName.value[0])) {
      alert('Trip name must start with a letter');
      tripName.value = '';
    }
  });

  //Read all trips
  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:3001/trips');
      const trips = await response.json();
      tripsContainer.innerHTML = '';
      trips.forEach(trip => {
        const tripElement = document.createElement('div');
        //card with trip name, start date, end date and delete button
        tripElement.className = 'col-md-4';
        tripElement.innerHTML = `
          <div class="card" onclick="populateForm('${trip._id}', '${trip.tripName}', '${trip.startDate}', '${trip.endDate}')">
            <div class="card-body" style="cursor:pointer;">
              <h5 class="card-title">${trip.tripName}</h5>
              <p class="card-text">Start Date: ${new Date(trip.startDate).toLocaleDateString()}</p>
              <p class="card-text">End Date: ${new Date(trip.endDate).toLocaleDateString()}</p>
              <button class="btn btn-danger" onclick="deleteTrip(event, '${trip._id}')">Delete</button>
            </div>
          </div>
        `;
        tripsContainer.appendChild(tripElement);
      });
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  
  tripForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (currentTripId) {
      // Update existing trip
      const tripName = document.getElementById('tripName').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      if (tripName && startDate && endDate) {
        await fetch(`http://localhost:3001/trips/${currentTripId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tripName, startDate, endDate })
        });
        tripForm.reset();
        updateTripButton.disabled = true;
        currentTripId = null;
        fetchTrips();
      }
    } else {
      // Create a new trip
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
    }
  });

  // Populate form with trip details for editing
  window.populateForm = (id, tripName, startDate, endDate) => {
    document.getElementById('tripName').value = tripName;
    document.getElementById('startDate').value = startDate.split('T')[0];
    document.getElementById('endDate').value = endDate.split('T')[0];
    updateTripButton.disabled = false;
    currentTripId = id;
  };

  // Delete a trip
  window.deleteTrip = async (event, id) => {
    event.stopPropagation();
    await fetch(`http://localhost:3001/trips/${id}`, {
      method: 'DELETE'
    });
    
    fetchTrips();
  };

  // Initial fetch of trips
  fetchTrips();
});