const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = 3000;

const pool = new Pool({
	user: "admin",
	host: "localhost",
	database: "postgres",
	password: "Abacaxi@123",
	port: 5432,
});

app.get("/", async (req, res) => {
	try {
		const result = await pool.query("SELECT NOW()");

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Connection or database query error!", error);
		res.status(500).send("Error connecting database.");
	}
});

app.listen(PORT, () => {
	console.log(`Server runing in http://localhost:${PORT}`);
});
