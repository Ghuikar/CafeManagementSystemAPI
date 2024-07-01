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
                (err, data) => {
                              
                    if (err) {
                        res.status(500).json({ message: "Error occurred while generating report", error: err });
                    } else {
                        const pdfOptions = { format: 'A10' };
                        pdf.create(data, pdfOptions).toFile(path.join(__dirname, 'reports', `${generateUuid}.pdf`), (err, result) => {
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

module.exports=router