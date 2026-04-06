const app = require('./app');
const { sequelize } = require('./config/database');
const {attempt} = require("joi");

const PORT = process.env.PORT || 3000;
const MAX_DB_RETRIES = 10;
const DB_RETRY_DELAY = 3000;

const server = app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Failed to start HTTP server:', err);
    process.exit(1);
});

const connectWithRetry = async (attempt = 1) => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully.');
        }
    } catch (err) {
        console.error(`Database connection failed (attempt ${attempt}):`, err);
        if (attempt > MAX_DB_RETRIES) {
            console.error('Max database connection attempts reached. Exiting.');
            process.exit(1);
        }
        setTimeout(() => connectWithRetry(attempt + 1), DB_RETRY_DELAY);
    }
};

connectWithRetry();

