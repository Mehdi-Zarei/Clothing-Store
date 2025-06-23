const { Sequelize } = require("sequelize");

const isDev = process.env.NODE_ENV !== "production";

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(`✅ [DB] Connected to "${process.env.DB_NAME}"`);

    await sequelize.sync({ alter: isDev });

    console.log(
      `🔁 [DB] Synced with "${process.env.DB_NAME}" (${
        isDev ? "altered" : "default sync"
      })`
    );
  } catch (error) {
    console.error("❌ [DB] Connection/Sync Error:", error.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  initializeDatabase,
};
