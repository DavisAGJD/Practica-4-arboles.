const sql = require('mssql');

const dbConfig = {
    user: 'David_arboles',
    password: '123456789',
    server: 'localhost',
    database: 'refaccionaria',
    options: {
        encrypt: false,
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log('Conectado a la base de datos');
        return pool;
    })
    .catch((err) => console.error('Error en la conexión a la base de datos', err));

module.exports = {
    sql,
    poolPromise,
};
