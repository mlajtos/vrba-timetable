import React, { PureComponent } from "react"
import moment from "moment"

import OrderForm from "../Form"
import ReservationStore from "../ReservationStore"

export default class DayView extends PureComponent {
    constructor(props) {
        super(props)

        const date = this.normalizeDate(props)
        const reservations = this.fetchReservations(date)
        this.state = { date, reservations }

        ReservationStore.addChangeListener(this.updateReservations.bind(this))
    }
    componentWillReceiveProps(props) {
        const date = this.normalizeDate(props)
        const reservations = this.fetchReservations(date)
        this.setState({ date, reservations })
    }
    updateReservations() {
        const reservations = this.fetchReservations(this.state.date)
        this.setState({ reservations })
    }
    normalizeDate(props) {
        return moment({...props.match.params, month: props.match.params.month - 1})
    }
    fetchReservations(date) {
        return ReservationStore.get(date)
    }
    render() {
        return (
            <div className="container-fluid">
                <OrderForm />
            </div>
        )
    }
}