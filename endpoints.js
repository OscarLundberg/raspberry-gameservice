
export default {
    "test": (req) => {
        return {"json": `Did you say ${req.query}?`}
    },
}