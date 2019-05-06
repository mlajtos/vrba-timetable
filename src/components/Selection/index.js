import React, { PureComponent } from "react"
import moment from "moment"
import "./style.css"
import { gridArea } from "../utils/grid"
import { formatDuration } from "../utils/datetime"

export default class Selection extends PureComponent {
    render() {
        const reservation = this.props.reservation

        if (!reservation) {
            return <div className="selection" />
        }

        const duration = moment.duration(reservation.to.diff(reservation.from))
        const showHint = (reservation.state !== "selected")

        const style = gridArea(reservation)
        return (
            <div style={style} className={`selection ${reservation.state} ${reservation.valid ? "valid" : "invalid"}`} onClick={this.props.onClick}>
                { showHint && <div className="time">{ reservation.from.format("HH:mm")} - {reservation.to.format("HH:mm") }</div> }
                { showHint && <div className="duration">{formatDuration(duration)}</div> }
            </div>
        )
    }
}