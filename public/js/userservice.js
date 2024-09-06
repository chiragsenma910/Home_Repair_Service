document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/appointments/user')
        .then(response => response.json())
        .then(data => {
            // console.log('Received appointments:', data);
            displayAppointments(data.services);
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
});

function displayAppointments(services) {
    const serviceList = document.querySelector('.service-list');

    if (services && services.length > 0) {
        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');

            // Construct HTML for displaying service details
            const serviceHTML = `
            <h3>${service.serviceName}</h3>
            <p>Date: ${service.date}</p>
            <p>Time Slot: ${service.timeSlot}</p>
            <p>Description: ${service.serviceDescription}</p>
            <div class="worker-details">
                <p>Worker Name: ${service.workerName}</p>
                <p>Worker Mobile No: ${service.workerMobile}</p>
            </div>
            <p class="status ${service.status.toLowerCase()}">Status: ${service.status}</p>
            ${service.status.toLowerCase() === 'completed' ? '<button class="proceed-to-pay-button" onclick="showPaymentPopup(' + service.appointmentId + ')">Proceed to Pay</button>' : ''}
            <button class="cancel-button" onclick="cancelRequest(${service.appointmentId})">Cancel</button>
            `;

            serviceItem.innerHTML = serviceHTML;
            serviceList.appendChild(serviceItem);
        });
    } else {
        const noAppointmentMessage = document.createElement('p');
        noAppointmentMessage.textContent = 'You do not have any appointments yet.';
        serviceList.appendChild(noAppointmentMessage);
    }
}


function cancelRequest(appointmentId) {
    fetch(`/api/appointments/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointmentId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Request cancelled successfully');
            location.reload();
        } else {
            alert(`Failed to cancel request: ${data.error}`);
        }
    })
    .catch(error => {
        console.error('Error cancelling request:', error);
        alert('Error cancelling request');
    });
}


function showPaymentPopup(appointmentId) {
    const popupHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3>Enter Payment Amount</h3>
                <input type="text" id="paymentAmount" placeholder="Amount" />
                <button onclick="processPayment(${appointmentId})">Pay</button>
                <button class="cancel-button" onclick="closePopup()">Cancel</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closePopup() {
    const popupOverlay = document.querySelector('.popup-overlay');
    if (popupOverlay) {
        popupOverlay.remove();
    }
}

function processPayment(appointmentId) {
    const paymentAmount = document.getElementById('paymentAmount').value;
    if (!paymentAmount) {
        alert('Please enter a payment amount');
        return;
    }
    const paymentProcessHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3>Processing Payment of ₹${paymentAmount}</h3>
                <img src="payment-processing.gif" alt="Processing" /> 
                <button onclick="completePayment(${appointmentId}, ${paymentAmount})">Done</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', paymentProcessHTML);
}

function completePayment(appointmentId, paymentAmount) {
    closePopup();

    const ratingPopupHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3>Rate the Service</h3>
                <input type="number" id="rating" min="1" max="5" placeholder="Rating (1-5)" />
                <button onclick="submitRating(${appointmentId}, ${paymentAmount})">Submit Rating</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', ratingPopupHTML);
}

function submitRating(appointmentId, paymentAmount) {
    const rating = document.getElementById('rating').value;

    if (!rating) {
        alert('Please enter a rating');
        return;
    }

    fetch('/api/review/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointmentId, paymentAmount, rating })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Rating submitted successfully');
            location.reload();
        } else {
            alert('Failed to submit rating');
        }
    })
    .catch(error => {
        console.error('Error submitting rating:', error);
        alert('Error submitting rating');
    });
}