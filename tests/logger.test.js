import { Logger } from "../functions/utils";

describe("Logger", () => {
  let consoleDebugSpy, consoleWarnSpy, consoleErrorSpy;

  beforeEach(() => {
    // Mock console methods
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console methods
    jest.restoreAllMocks();
  });

  test("should initialize with logging disabled by default", () => {
    const logger = new Logger(false);
    expect(logger.logging).toBe(false);
  });

  test("should initialize with logging enabled when set to true", () => {
    const logger = new Logger(true);
    expect(logger.logging).toBe(true);
  });

  test("should log debug message when logging is enabled", () => {
    const logger = new Logger(true);
    logger.debug("Test debug message");

    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    expect(consoleDebugSpy).toHaveBeenCalledWith(expect.any(Number), [
      "Test debug message",
    ]);
  });

  test("should not log debug message when logging is disabled", () => {
    const logger = new Logger(false);
    logger.debug("Test debug message");

    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });

  test("should log warning message when logging is enabled", () => {
    const logger = new Logger(true);
    logger.warn("Test warning message");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.any(Number), "WARNING", [
      "Test warning message",
    ]);
  });

  test("should not log warning message when logging is disabled", () => {
    const logger = new Logger(false);
    logger.warn("Test warning message");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  test("should log error message when logging is enabled", () => {
    const logger = new Logger(true);
    logger.error("Test error message");

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Number), "ERROR", [
      "Test error message",
    ]);
  });

  test("should not log error message when logging is disabled", () => {
    const logger = new Logger(false);
    logger.error("Test error message");

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test("should handle multiple message arguments correctly", () => {
    const logger = new Logger(true);
    logger.debug("Message1", "Message2", "Message3");

    expect(consoleDebugSpy).toHaveBeenCalledWith(expect.any(Number), [
      "Message1",
      "Message2",
      "Message3",
    ]);
  });
});
