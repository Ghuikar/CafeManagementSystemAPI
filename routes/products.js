const express = require("express");
const router = express.Router();
const connection = require("../connection");
const auth = require("../services/authentication"); // Adjust the path as needed
const checkRole = require("../services/checkRole"); // Adjust the path as needed

router.post("/add", auth, checkRole, (req, res) => {
  const { name, categoryId, description, price, status } = req.body;

  const query =
    "INSERT INTO products (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, ?)";
  connection.query(query,[name, categoryId, description, price, status],(err, result) => {
      if (!err) {
        res.status(201).json({
          message: "Product added successfully",
          productId: result.insertId,
        });
      } else {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

router.get("/get", (req, res) => {
  const query =
    "SELECT  products.id, products.name AS productName, category.name AS categoryName, products.description, products.price,  products.status, category.id as CategoryId  FROM  products INNER JOIN  category WHERE products.categoryId = category.id";

  connection.query(query, (err, result) => {
    if (!err) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ Error: err });
    }
  });
});

router.get("/getByCategory/:id", (req, res) => {
  const categoryId = req.params.id;

  const query = "SELECT * FROM products WHERE categoryId = ?";
  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(results);
  });
});

router.get("/getById/:id", (req, res) => {
  const id = req.params.id;

  const query = "SELECT * FROM products WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(results);
  });
});

router.patch("/update", (req, res) => {
  const { name, categoryId, description, price,id } = req.body;

  const query =
    "UPDATE products SET name = ?, categoryId = ?, description = ?, price = ? WHERE id = ?";

  connection.query(query,[name, categoryId, description, price, id],(err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});


router.delete("/delete/:id", (req, res) => {
    const productId = req.params.id;

    const query = `DELETE FROM products WHERE id = ?`;

    connection.query(query, [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    });
});

router.patch("/updateStatus", (req, res) => {
    const { id, status } = req.body; 

    if (!id || !status) {
        return res.status(400).json({ error: 'Both id and status are required' });
    }

    const query = `UPDATE products SET status = ? WHERE id = ?`;

    connection.query(query, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product status updated successfully' });
    });
});


module.exports = router;
