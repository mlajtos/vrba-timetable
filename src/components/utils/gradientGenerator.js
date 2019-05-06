import * as d3 from "d3"

const gradientGenerator = (color, deviation = 0.3) => {
    const center = d3.color(color)
    const top = center.brighter(deviation)
    const bottom = center.darker(deviation)
    return `linear-gradient(${top} 5%, ${center}, ${bottom} 95%)`
}

export default gradientGenerator