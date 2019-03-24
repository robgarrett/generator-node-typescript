
// Scaffolding for basic node service.
abstract class Server {
  public static async start() {
    // Start the server.
    while (true) {
      // Do something here.
      console.log("Running server iteration");
      // Wait for the delay to finish.
      await Server.delay(2000);
      // Do something here.
      console.log("Finishing server iteration");
    }
  }

  // Delay function that promises to return after timeout.
  private static async delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms, true));
  }
}

// Start the server.
Server.start();
