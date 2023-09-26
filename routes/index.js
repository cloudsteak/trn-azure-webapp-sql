var express = require('express');
var router = express.Router();

const sql = require('mssql');
require('dotenv').config()

var os = require("os");
var hostname = os.hostname();

const server = process.env.DB_SERVER;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME;
const port = parseInt(process.env.DB_PORT);

const config = {
    user,
    password,
    server,
    port,
    database,
    options: {
      encrypt: true
    }
  }
const pool = new sql.ConnectionPool(config);

pool.connect().then(() => {
  console.log('Connected to Azure SQL Database');
}).catch(err => {
  console.error('Error connecting to Azure SQL Database:', err);
});

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query(`SELECT pc.name as CategoryName,
    p.name as ProductName 
    FROM [dbo].[ProductCategory] pc
    JOIN [dbo].[Product] p ON pc.productcategoryid = p.productcategoryid
    ORDER BY ProductName`);
    //res.json(result.recordset);
    const data = result.recordset;
    res.render('index', { title: "Termék katalógus (Azure WebApp + SQL)", error: "", data, hostname: hostname });
    closeConnection();

  } catch (err) {
    console.error('Error executing SQL query:', err);
    //res.status(500).json({ error: 'Internal Server Error' });
    const data = [
      { ProductName: "", CategoryName: "" }
    ];
    res.render('index', { title: "Termék katalógus (Azure WebApp + SQL)", error: "Adatbázis hiba", data });
    closeConnection();
  }
  

});

module.exports = router;


function closeConnection(){
  process.on('SIGINT', () => {
    pool.close().then(() => {
      console.log('Connection pool closed');
      process.exit(0);
    });
  });
}