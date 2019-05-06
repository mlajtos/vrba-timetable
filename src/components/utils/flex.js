const flex = (n, [one, many, tooMany]) => {
    switch (n) {
        case 1: return `${n} ${one}`
        case 2:
        case 3:
        case 4: return `${n} ${many}`
        default: return `${n} ${tooMany}`
    }
}

export default flex