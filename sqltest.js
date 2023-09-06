const sql = require('mssql');
require('dotenv').config()
//dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

const server = process.env.DB_SERVER;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME;
const port = parseInt(process.env.DB_PORT);

const config = {
    server: server,
    user: user,
    password: password,
    port: port,
    database: database,
    authentication: {
        type: 'default'
    },
    options: {
      encrypt: true
    }
  }
console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`SELECT TOP 20 pc.name as CategoryName,
            p.name as ProductName 
            FROM [dbo].[ProductCategory] pc
            JOIN [dbo].[Product] p ON pc.productcategoryid = p.productcategoryid`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.CategoryName, row.ProductName);
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}