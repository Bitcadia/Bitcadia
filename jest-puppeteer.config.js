module.exports = {
  verbose: true,
  launch: {
    headless: false,
  },
  coverageDirectory: "./integration",
  collectCoverageFrom: ["**/*"],
  coverageReporters: ["json", "lcovonly", "html"]
}
