import React, { PureComponent } from "react"
import "./style.css"

import { grid } from "../utils/grid"

export default class Grid extends PureComponent {
    render() {
        const { tracks, slotsPerTrack } = this.props
        const style = grid(tracks, slotsPerTrack)

        return (
            <div
                className="grid"
                style={style}
                onMouseLeave={this.props.endSelection}
            >
                { this.props.children }
            </div>
        )
    }
}