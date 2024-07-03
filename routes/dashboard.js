const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");



router.get('/details', (req, res) => {
    let categoryCount, billCount, productsCount;

    // Query to get category count
    const queryCategory = 'SELECT COUNT(id) AS categoryCount FROM category';

    connection.query(queryCategory, (err, results) => {
        if (err) {
            console.error("Error fetching category count:", err);
            categoryCount = 0; // Default value if query fails
        } else {
            categoryCount = results[0].categoryCount;
        }

        // Query to get bill count
        const queryBill = 'SELECT COUNT(id) AS billCount FROM Bill';

        connection.query(queryBill, (err, results) => {
            if (err) {
                console.error("Error fetching bill count:", err);
                billCount = 0; // Default value if query fails
            } else {
                billCount = results[0].billCount;
            }

            // Query to get products count
            const queryProducts = 'SELECT COUNT(id) AS productsCount FROM products';

            connection.query(queryProducts, (err, results) => {
                if (err) {
                    console.error("Error fetching products count:", err);
                    productsCount = 0; // Default value if query fails
                } else {
                    productsCount = results[0].productsCount;
                }

                // Respond with the fetched counts
                res.status(200).json({
                    categoryCount: categoryCount,
                    billCount: billCount,
                    productsCount: productsCount
                });
            });
        });
    });
});


module.exports=router