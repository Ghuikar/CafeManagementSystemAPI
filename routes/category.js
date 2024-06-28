const express = require("express");
const connection = require("../connection");
require("dotenv").config();

const auth = require("../services/authentication"); // Adjust the path as needed
const checkRole = require("../services/checkRole"); // Adjust the path as needed

const router = express.Router();

router.post("/add", auth, checkRole, (req, res) => {
  const { name } = req.body;
  const query = "INSERT into category (name) VALUES(?)";

  connection.query(query, [name], (err, result) => {
    if (!err) {
      res.status(200).json({ message: "Successfully Added" });
    } else {
      res.status(500).json(err);
    }
  });
});

router.get("/get", (req, res) => {
  const query = "SELECT *FROM category order BY name";
  connection.query(query, (err, result) => {
    if (!err) {
      res.status(200).json({ Categories: result });
    } else {
      res.status(500).json({ Error: err });
    }
  });
});


router.patch('/update', auth, checkRole,(req,res)=>{

    const {id,name}=req.body

    const query="UPDATE category SET name = ? WHERE id = ?"
    connection.query(query,[name,id],(err,result)=>{

        if(!err){
            if(result.affectedRows==0){
                res.status(500).json({message:"Something went wrong"})
                
            }else{
                res.status(200).json({message:"Successfully Updated"})
            }
        }else{
            
            res.status(500).json({Error:err})
        }
    })

})

module.exports = router;
