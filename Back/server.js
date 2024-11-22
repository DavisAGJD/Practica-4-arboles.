const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { poolPromise, sql } = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Ruta para obtener todos los camiones
app.get("/api/camiones", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Camion");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener camiones:", err);
        res.status(500).send({
            error: "Error al obtener camiones",
            details: err.message,
        });
    }
});

// Ruta para agregar un camión
app.post("/api/camiones", async (req, res) => {
    const { nombre, totalmacenaje, placas, marca } = req.body;

    // Validar datos del cliente
    if (!nombre || !totalmacenaje || !placas || !marca) {
        return res.status(400).send({
            error: "Todos los campos son obligatorios",
            fields: { nombre, totalmacenaje, placas, marca },
        });
    }

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("Nombre", sql.VarChar, nombre)
            .input("Totalmacenaje", sql.Decimal, totalmacenaje)
            .input("Placas", sql.VarChar, placas)
            .input("Marca", sql.VarChar, marca)
            .query(
                "INSERT INTO Camion (Nombre, Totalmacenaje, Placas, Marca) OUTPUT Inserted.* VALUES (@Nombre, @Totalmacenaje, @Placas, @Marca)"
            );

        res.json(result.recordset[0]); // Camión insertado
    } catch (err) {
        console.error("Error al agregar camión:", err);

        // Manejo de errores específicos
        if (err.code === "EREQUEST") {
            // Error relacionado con la consulta SQL
            res.status(500).send({
                error: "Error en la consulta SQL",
                details: err.message,
            });
        } else if (err.code === "ESOCKET") {
            // Error relacionado con la conexión al servidor
            res.status(500).send({
                error: "Error de conexión al servidor de base de datos",
                details: err.message,
            });
        } else {
            // Error genérico
            res.status(500).send({
                error: "Error desconocido al agregar camión",
                details: err.message,
            });
        }
    }
});

// Ruta para manejar errores 404
app.use((req, res) => {
    res.status(404).send({
        error: "Recurso no encontrado",
    });
});

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
