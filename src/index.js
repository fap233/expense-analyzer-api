const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

const PORT = 3000;

const pool = new Pool({
	user: "admin",
	host: "localhost",
	database: "expense_analyzer_db",
	password: "Abacaxi@123",
	port: 5432,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Expense analyzer api is online!");
});

app.post("/expenses", async (req, res) => {
	const { description, amount, category } = req.body;

	if (!description || !amount) {
		return res
			.status(400)
			.json({ error: "Description and amount are required." });
	}

	try {
		const sqlQuery = `
  INSERT INTO expenses (description, amount, category)
  VALUES($1, $2, $3)
  RETURNING *;
`;

		const values = [description, amount, category || null];

		const result = await pool.query(sqlQuery, values);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error trying to insert expense:", error);
		res.status(500).json({ error: "Intern server error." });
	}
});

app.get("/expenses", async (req, res) => {
	try {
		const sqlQuery = "SELECT * FROM expenses ORDER BY created_at DESC;";

		const result = await pool.query(sqlQuery);

		res.status(200).json(result.rows);
	} catch (error) {
		console.error("Connection or database query error!", error);
		res.status(500).json({ error: "Intern error." });
	}
});

app.listen(PORT, () => {
	console.log(`Server runing in http://localhost:${PORT}`);
});
