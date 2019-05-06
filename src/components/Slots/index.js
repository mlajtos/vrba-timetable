import React, { PureComponent } from "react"
import "./style.css"
import "./style.sass"

export default class Slots extends PureComponent {
    render() {
        const emptySlots = this.props.slots
        return emptySlots.map(slot => (
            <Slot
                key={`slot-${slot.id}`}
                {...slot}
                beginSelection={this.props.beginSelection.bind(this, slot)}
                changeSelection={this.props.changeSelection.bind(this, slot)}
                endSelection={this.props.endSelection.bind(this, slot)}
            />
        ))
    }
}

class Slot extends PureComponent {
    constructor(props) {
        super(props)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onClick = this.onClick.bind(this)
        this.lastElement = null
    }
    componentDidMount() {
        this.el.addEventListener("touchEnter", this.props.changeSelection)
    }
    onMouseEnter(event) {
        if (event.buttons) {
            this.props.changeSelection()
        }
    }
    onTouchMove(event) {
        const touch = event.touches[0]
        const element = document.elementFromPoint(touch.clientX, touch.clientY)
        if (element && element !== this.lastElement) {
            this.lastElement = element
            element.dispatchEvent(new Event("touchEnter"))
        }
    }
    onClick(e) {
        console.log({...e})
        e.preventDefault()
    }
    render() {
        const { row, column, from, available } = this.props
        const style = {
            gridArea: `${row + 1} / ${column + 1}`
        }
        return (
            <slot
                ref={el => this.el = el}
                style={style}
                className={`${available ? "available" : ""}`}
                onMouseDown={this.props.beginSelection}
                onMouseEnter={this.onMouseEnter}
                onMouseUp={this.props.endSelection}
                onTouchStart={this.props.beginSelection}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.props.endSelection}
                onClick={this.onClick}
            >
                <div className="time from">{from.format("HH:mm")}</div>
            </slot>
        )
    }
}