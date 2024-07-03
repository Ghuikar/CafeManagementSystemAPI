const express = require("express");
const connection = require("../connection");
const router = express.Router();

const ejs=require('ejs')
const path = require('path')
const pdf=require('html-pdf')
const fs=require('fs')
const uuid=require('uuid')

const auth=require('../services/authentication')


// post method to generate Report



router.post('/generateReport',(req,res)=>{

    const generateUuid=uuid.v1()
    const { name, email, contactNumber, paymentMethod, total, productDetails, createdBy } = req.body;
    const productDetailsReport=(productDetails)

    const query = `
        INSERT INTO Bill (uuid, name, email, contactNumber, paymentMethod, total, productDetails, createdBy) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [generateUuid, name, email, contactNumber, paymentMethod, total, JSON.stringify(productDetails), createdBy],
        (err, result) => {

            if (!err) {
                ejs.renderFile(path.join(__dirname, 'report.ejs'), { name, email, contactNumber, paymentMethod, totalAmount: total, productDetails: productDetailsReport }, 
                (err, html) => {              
                    if (err) {
                        res.status(500).json({ message: "Error occurred while generating report", error: err });
                    } else {
                        const pdfOptions = { format: 'A4' };

                        // pdf.create(html, options).toFile(filepath, callback)
                        pdf.create(html, pdfOptions).toFile(path.join('./generated_pdf/' + `${generateUuid}.pdf`), (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error occurred while generating PDF", error: err });
                            } else {
                                res.status(201).json({ message: "Bill created and PDF generated successfully", uuid: generateUuid });
                            }
                        });
                    }
                });
            } else {
                res.status(500).send(err);
            }
        }
    );
});



router.post('/getPdf',(req,res)=>{
    const {uuid, name, email, contactNumber, paymentMethod, total, productDetails, createdBy } = req.body;
    
   const pdfPath =  './generated_pdf/' + uuid + ".pdf";
    console.log("pdfPath",pdfPath);
    console.log("fs.existsSync(pdfPath)",fs.existsSync(pdfPath))
    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      fs.createReadStream(pdfPath).pipe(res);
    } else {

        ejs.renderFile(path.join(__dirname, 'report.ejs'), { name, email, contactNumber, paymentMethod, totalAmount: total, productDetails }, 
        (err, html) => {              
            if (err) {
                res.status(500).json({ message: "Error occurred while generating report", error: err });
            } else {
                const pdfOptions = { format: 'A4' };

                // pdf.create(html, options).toFile(filepath, callback)
                pdf.create(html, pdfOptions).toFile(path.join('./generated_pdf/' + uuid +`.pdf`), (err, result) => {
                    if (err) {
                        res.status(500).json({ message: "Error occurred while generating PDF", error: err });
                    } else {
                        res.status(201).json({ message: "Bill created and PDF generated successfully", uuid: uuid });
                    }
                });
            }
        });


    }



})


// GET all bills
router.get('/getBills', (req, res) => {
    const query = "SELECT * FROM Bill order by id DESC";

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching bills:", err);
            res.status(500).json({ error: "Failed to fetch bills" });
            return;
        }

        res.status(200).json(results);
    });
});


router.delete('/deleteBill/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const query = "DELETE FROM Bill WHERE id = ?";

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting bill:", err);
            res.status(500).json({ error: "Failed to delete bill" });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Bill not found" });
            return;
        }

        res.status(200).json({ message: "Bill deleted successfully" });
    });
});



module.exports=router