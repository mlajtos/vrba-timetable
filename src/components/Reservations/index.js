import React, { PureComponent } from "react"
import "./style.css"
import { colorScale } from "../Table"
import gradientGenerator from "../utils/gradientGenerator"
import { gridArea } from "../utils/grid"
import person from "./person.svg"
import food from "./food.svg"
import privateCompany from "./private.svg"

export default class Reservations extends PureComponent {
    render() {
        console.log("render reservations", )
        const reservations = this.props.reservations
        return reservations.map(reservation => (
            <ReservationPill key={reservation.id} {...reservation} onClick={this.props.onSelect.bind(this, reservation)} />
        ))
    }
}

class ReservationPill extends PureComponent {
    render() {
        const reservation = this.props

        const style = {
            ...gridArea(reservation),
            background: gradientGenerator(colorScale(reservation.id))
        }

        return (
            <div key={reservation.id} style={style} className="reservation" onClick={this.props.onClick}>
                <div className="summary">
                    <div className="time">{reservation.from.format("HH:mm")} – {reservation.to.format("HH:mm")}</div>
                    <div className="emblems">
                        <Emblem icon={person}>{ reservation.people }</Emblem>
                        { reservation.privateCompany && <Emblem icon={privateCompany} /> }
                        { reservation.catering && <Emblem icon={food} /> }
                    </div>
                </div>
                <div className="details">
                    <div className="name">{reservation.name}</div>
                    <div className="note">{reservation.note}</div>
                </div>
            </div>
        )
    }
}

const Emblem = ({ icon, children }) => (
    <div className="emblem">
        <img src={icon} className="inline-icon" alt="icon" />
        <span>{ children }</span>
    </div>
)