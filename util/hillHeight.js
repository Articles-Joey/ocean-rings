export function hillHeight(x, z) {
    return (
        Math.sin(z * 0.35) * 0.45 +
        Math.sin(z * 0.8 + x * 0.2 + 1.1) * 0.25 +
        Math.sin(z * 1.5 + x * 0.15 + 2.2) * 0.15
    )
}
