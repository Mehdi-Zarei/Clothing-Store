require("dotenv").config();
const app = require("./app");
const { initializeDatabase } = require("./configs/db");
const { connectRedis } = require("./configs/redis");

const startServer = async (app, port) => {
  try {
    await Promise.all([connectRedis(), initializeDatabase()]);

    app.listen(port, () => {
      const env = process.env.NODE_ENV || "development";

      console.log(`🚀 Server is up and running at: ${process.env.DOMAIN}`);
      console.log(`✅ Running in ${env.toUpperCase()} mode`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer(app, process.env.PORT || 4000);
