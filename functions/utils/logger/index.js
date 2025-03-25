export default class Logger {
  logging = false;
  constructor(status) {
    this.logging = status;
  }
  debug(...message) {
    if (this.logging) {
      const currentTime = Number(new Date());
      console.debug(currentTime, message);
    }
  }
  warn(...message) {
    if (this.logging) {
      const currentTime = Number(new Date());
      console.warn(currentTime, "WARNING", message);
    }
  }
  error(...message) {
    if (this.logging) {
      const currentTime = Number(new Date());
      console.error(currentTime, "ERROR", message);
    }
  }
}
