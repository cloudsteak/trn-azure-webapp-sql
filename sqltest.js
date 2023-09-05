const sql = require('mssql');
require('dotenv').config() 
console.log(process.env.DB_USER)

const config = {
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    port: 1433, 
    database: process.env.DB_NAME, 
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