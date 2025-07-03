class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req, res) {
        try {
            const bookingData = req.body;
            const newBooking = await this.bookingService.createBooking(bookingData);
            res.status(201).json(newBooking);
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking', error: error.message });
        }
    }

    async getBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving booking', error: error.message });
        }
    }

    async updateBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const updatedData = req.body;
            const updatedBooking = await this.bookingService.updateBooking(bookingId, updatedData);
            if (!updatedBooking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(updatedBooking);
        } catch (error) {
            res.status(500).json({ message: 'Error updating booking', error: error.message });
        }
    }

    async deleteBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const deleted = await this.bookingService.deleteBooking(bookingId);
            if (!deleted) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting booking', error: error.message });
        }
    }
}

export default BookingController;