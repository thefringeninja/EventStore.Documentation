module.exports = {
    error(message) {
        console.log("\x1b[41m%s\x1b[0m", ' ERROR ', `${message}\n`)
        process.exit(0)
    },
    info(message) {
        console.log("\x1b[44m%s\x1b[0m", ' INFO ', `${message}\n`)
    },
    success(message) {
        console.log("\x1b[42m\x1b[30m%s\x1b[0m", ' DONE ', `${message}\n`)
    }
}
