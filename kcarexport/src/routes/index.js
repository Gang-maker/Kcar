const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes
router.get('/bookings', bookingController.getAllBookings);
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

// Export the router
module.exports = router;