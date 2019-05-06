import mock_reservations from "./utils/mockReservations"

class ReservationStore {
    constructor() {
        this.reservations = mock_reservations
        this.changeListeners = []
    }
    add(reservation) {
        this.reservations.push(reservation)
        this.onChange()
    }
    get(date) {
        return this.reservations.filter(reservation => reservation.from.isSame(date, "day"))
    }
    onChange() {
        this.changeListeners.forEach(listener => listener.call())
    }
    addChangeListener(listener) {
        this.changeListeners.push(listener)
    }
}

const instance = new ReservationStore()

export default instance