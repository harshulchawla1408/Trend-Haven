const express = require('express')
const app = express()
const port = 9000
app.use(express.json());

var cors = require('cors')
app.use(cors())

const fs = require('fs');

const multer  = require('multer')

let mystorage = multer.diskStorage({ 
    destination: (req, file, cb) => 
    {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => 
    {
        var picname = Date.now() + file.originalname;
        cb(null, picname);
    }
  });
  let upload = multer({ storage: mystorage });

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/projectdb').then(() => console.log('Connected to MongoDB!'));

//Signup page
var signupSchema = mongoose.Schema({pname:String,phone:String,username:{type:String,unique:true},password:String,usertype:String},{versionKey:false})
var SignupModel = mongoose.model("signup",signupSchema,"signup");

app.post("/api/signup",async(req,res)=>
{
    var newrecord = new SignupModel({pname:req.body.name,phone:req.body.phone,username:req.body.uname,password:req.body.pass,usertype:"normal"})    
   
    var result = await newrecord.save();
    
    if(result)
    {
        res.status(200).send({statuscode:1,msg:"Signup Successfull"})
    }
    else
    {
        res.status(500).send({statuscode:0,msg:"Signup not successfull"})
    }    
})

//Login page
app.post("/api/login",async(req,res)=>
{
    var result = await SignupModel.find({username:req.body.uname,password:req.body.pass}).select("-password").select("-phone");
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,pdata:result[0]})
    }    
})

//Search user
app.get("/api/searchuser",async(req,res)=>
{
    var result = await SignupModel.find({username:req.query.un})
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,searchdata:result})
    }    
})

app.get("/api/getallusers",async(req,res)=>
{
    var result = await SignupModel.find().sort({"Name":1});
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,membersdata:result})
    }    
})

app.delete("/api/deluser/:uid",async(req,res)=>
{
    var result = await SignupModel.deleteOne({_id:req.params.uid})
    if(result.deletedCount===1)
    { 
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

//Change password
app.put("/api/changepassword",async(req,res)=>
{
    try
    {
        var updateresult = await SignupModel.updateOne({username: req.body.uname,password: req.body.currpass}, { $set: {password:req.body.newpass}});

        if(updateresult.modifiedCount===1)
        {
            res.status(200).send({statuscode:1})
        }
        else
        {
            res.status(200).send({statuscode:0})
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({statuscode:-1,msg:"Some error occured"})
    }
})

//Manage Category
var catSchema = mongoose.Schema({catname:String,catpic:String},{versionKey:false})

var CatModel = mongoose.model("category",catSchema,"category");

app.post("/api/savecategory",upload.single('catpic'),async(req,res)=>
{
    var picturename;
    if(!req.file)
    {
        picturename="noimage.jpg";
    }
    else
    {
        picturename=req.file.filename;
    }
    var newrecord = new CatModel({catname:req.body.catname,catpic:picturename})    
    var result = await newrecord.save();
    if(result)
    {
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

app.get("/api/getallcat",async(req,res)=>
{
    var result = await CatModel.find();
    
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,catdata:result})
    }    
})


app.put("/api/updatecategory",upload.single('catpic'),async(req,res)=>
{
    try
    {
        var picturename;
        if(!req.file)
        {
            picturename=req.body.oldpicname;
        }
        else
        {
            picturename=req.file.filename;

            if(req.body.oldpicname!=="noimage.jpg")
            {
                fs.unlinkSync(`public/uploads/${req.body.oldpicname}`);
            }
        }

        var updateresult = await CatModel.updateOne({ _id: req.body.cid }, { $set: {catname:req.body.catname,catpic:picturename}});

        if(updateresult.modifiedCount===1)
        {
            res.status(200).send({statuscode:1})
        }
        else
        {
            res.status(500).send({statuscode:0})
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({statuscode:-1,msg:"Some error occured"})
    }
}) 
app.delete("/api/delcat/:cid",async(req,res)=>
    {
        var result = await CatModel.deleteOne({_id:req.params.cid})
        if(result.deletedCount===1)
        { 
            res.status(200).send({statuscode:1})
        }
        else
        {
            res.status(200).send({statuscode:0})
        }    
    })

//Manage Sub category
var subcatSchema = mongoose.Schema({subcatname:String,subcatpic:String,catid:String},{versionKey:false})

var SubCatModel = mongoose.model("subcategory",subcatSchema,"subcategory");

app.post("/api/savesubcategory", upload.single('subcatpic'), async (req, res) => {
    var picturename;
    if (!req.file) {
        picturename = "noimage.jpg";
    } else {
        picturename = req.file.filename;
    }
    var newrecord = new SubCatModel({
        subcatname: req.body.subcatname,
        subcatpic: picturename,
        catid: req.body.categoryid
    });
    var result = await newrecord.save();
    if (result) {
        res.status(200).send({ statuscode: 1 });
    } else {
        res.status(200).send({ statuscode: 0 });
    }
});

app.get("/api/getallsubcat", async (req, res) => {

    var result = await SubCatModel.find({catid:req.query.cid});    
    if (result.length === 0) {
        res.status(200).send({ statuscode: 0 });
    } else {
        res.status(200).send({ statuscode: 1, subcatdata: result });

    }
});

app.put("/api/updatesubcategory", upload.single('subcatpic'), async (req, res) => {
    try {
        var picturename;
        if (!req.file) {
            picturename = req.body.oldpicname;
        } else {
            picturename = req.file.filename;

            if (req.body.oldpicname !== "noimage.jpg") {
                fs.unlinkSync(`uploads/${req.body.oldpicname}`);
            }
        }

        var updateresult = await SubCatModel.updateOne({ _id: req.body.subcatid }, { $set: {subcatname: req.body.subcatname, subcatpic: picturename, catid: req.body.categoryid}});

        if (updateresult.modifiedCount === 1) {
            res.status(200).send({ statuscode: 1 });
        } else {
            res.status(500).send({ statuscode: 0 });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ statuscode: -1, msg: "Some error occurred" });
    }
});

app.delete("/api/delsubcat/:sid", async (req, res) => {
    var result = await SubCatModel.deleteOne({ _id: req.params.sid });
    if (result.deletedCount === 1) {
        res.status(200).send({ statuscode: 1 });
    } else {
        res.status(200).send({ statuscode: 0 });
    }
});

//Manage Products
var prodSchema = mongoose.Schema({catid:String,subcatid:String,pname:String,Rate:Number,Discount:Number,Stock:Number,Description:String,picture:String,addedon:String},{versionKey:false})
var ProdModel = mongoose.model("product",prodSchema,"product");

app.post("/api/saveproduct",upload.single('picture'),async(req,res)=>
{
    var picturename;
    if(!req.file)
    {
        picturename="noimage.jpg";
    }
    else
    {
        picturename=req.file.filename;
    }
    var newrecord = new ProdModel({catid:req.body.catid, subcatid:req.body.subcatid, pname:req.body.pname,Rate:req.body.rate,Discount:req.body.dis,Stock:req.body.stock,Description:req.body.descp,picture:picturename,addedon:new Date()}) 

    var result = await newrecord.save();

    if(result)
    {
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

app.get("/api/fetchprodsbycatid",async(req,res)=>
{
    var result = await SubCatModel.find({catid:req.query.cid})
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,subcatdata:result})
    }    
})

app.get("/api/fetchprodsbysubcatid",async(req,res)=>
{
    var result = await ProdModel.find({subcatid:req.query.sid})
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,proddata:result})
    }    
})


app.get("/api/getproddetails",async(req,res)=>
    {
        var result = await ProdModel.find({_id:req.query.pid})
        if(result.length===0)
        {
            res.status(200).send({statuscode:0})
        }
        else
        {
            res.status(200).send({statuscode:1,proddata:result[0]})
        }    
    })

app.put("/api/updateproduct", upload.single('picture'), async (req, res) => {
    try{
        var picturename;
        if (!req.file) 
        {
        picturename = req.body.oldpicname;
       } 
       else
      {
        picturename = req.file.filename;

        if (req.body.oldpicname !== "noimage.jpg") 
            {
            fs.unlinkSync(`uploads/${req.body.oldpicname}`);
    }
    }
    
    var updateresult = await ProdModel.updateOne({_id: req.body.pid}, {$set: {pname:req.body.pname,Rate: req.body.rate, Discount: req.body.dis, Stock: req.body.stock, Description: req.body.descp,picture: picturename}});
    if (updateresult.modifiedCount===1) {
        res.status(200).send({ statuscode: 1 });
    } else {
        res.status(200).send({ statuscode: 0 });
    }
    } catch (e) {
        console.log(e.message);
            res.status(500).send({ statuscode: -1, msg: "Some error occurred" });
    }
});


app.delete("/api/delproduct/:id", async (req, res) => {
    var result = await ProdModel.deleteOne({_id: req.params.id});
    if (result) {
        res.status(200).send({ statuscode: 1 });
    } else {
        res.status(200).send({ statuscode: 0 });
    }
});

//Show Cart
var cartSchema = mongoose.Schema({pid:String,picture:String,ProdName:String,Rate:Number,Qty:Number,TotalCost:Number,Username:String},{versionKey:false})
var CartModel = mongoose.model("cart",cartSchema,"cart");

app.post("/api/savetocart",async(req,res)=>
{

    var newrecord = new CartModel({pid:req.body.pid,picture:req.body.picture,ProdName:req.body.pname,Rate:req.body.rate,Qty:req.body.qty,TotalCost:req.body.tc,Username:req.body.username}) 

    var result = await newrecord.save();

    if(result)
    {
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

app.get("/api/getcart",async(req,res)=>
{
    try
    {
        var result = await CartModel.find({Username:req.query.un})
        if(result.length===0)
        {
            res.status(200).send({statuscode:0})
        }
        else
        {
            res.status(200).send({statuscode:1,cartinfo:result})
        }
    }
    catch(e)
    {
        res.status(500).send({statuscode:-1,errmsg:e.message})
    }
})

app.delete("/api/delcartitem/:uid",async(req,res)=>
    {
        var result = await CartModel.deleteOne({_id:req.params.uid})
        if(result.deletedCount===1)
        {
            res.status(200).send({statuscode:1})
        }
        else{
            res.status(200).send({statuscode:0})
        }
})

//Order Details
var orderSchema = mongoose.Schema({saddress:String,billamt:Number,username:String,OrderDate:String,PayMode:String,CardDetails:Object,OrderProducts:[Object],status:String},{versionKey:false})
var OrderModel = mongoose.model("finalorder",orderSchema,"finalorder");

app.post("/api/saveorder",async(req,res)=>
{

    var newrecord = new OrderModel({saddress:req.body.saddr,billamt:req.body.tbill,username:req.body.uname,OrderDate:new Date(),PayMode:req.body.pmode,CardDetails:req.body.carddetails,OrderProducts:req.body.cartinfo}) 

    var result = await newrecord.save();

    if(result)
    {
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

app.put("/api/updatestock",async(req,res)=>
{
    try
    {
        var cartdata = req.body.cartinfo;
        for(var x=0;x<cartdata.length;x++)
        {
            var updateresult = await ProdModel.updateOne({_id: cartdata[x].pid}, {$inc:{"Stock":-cartdata[x].Qty}});
        }
        if(updateresult.modifiedCount===1)
        {
            res.status(200).send({statuscode:1})
        }
        else
        {
            res.status(200).send({statuscode:0})
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({statuscode:-1,msg:"Some error occured"})
    }
})

app.delete("/api/deletecart",async(req,res)=>
{
    var result = await CartModel.deleteMany({Username:req.query.un})
    if(result.deletedCount>=1)
    {
        res.status(200).send({statuscode:1})
    }
    else
    {
        res.status(200).send({statuscode:0})
    }    
})

app.get("/api/getorderid",async(req,res)=>
    {
        try 
        {
            var result = await OrderModel.findOne({username:req.query.un}).sort({"OrderDate":-1});
            if(result)
            {
                res.status(200).send({statuscode:1,orderdata:result})
            }
            else  
            {
                res.status(200).send({statuscode:0})
            }
        }
        catch(e)
        {
            res.status(500).send({statuscode:-1,errmsg:e.message})
        }
    })

app.get("/api/getallorders",async(req,res)=>
{
    var result = await OrderModel.find().sort({"OrderDate":-1})
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,ordersdata:result})
    }    
})

app.get("/api/getuserorders",async(req,res)=>
{
    var result = await OrderModel.find({username:req.query.un}).sort({"OrderDate":-1})

    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,ordersdata:result})
    }    
})

app.get("/api/getorderproducts",async(req,res)=>
{
    var result = await OrderModel.findOne({_id:req.query.orderno});
    if(result.length===0)
    {
        res.status(200).send({statuscode:0})
    }
    else
    {
        res.status(200).send({statuscode:1,items:result.OrderProducts})
    }    
})


app.put("/api/updatestatus",async(req,res)=>
{ 
    try
    {
        var updateresult = await OrderModel.updateOne({_id: req.body.orderid}, { $set: {status:req.body.newst}});
       

        if(updateresult.modifiedCount===1)
        {
            res.status(200).send({statuscode:1})
        }
        else
        {
            res.status(200).send({statuscode:0})
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send({statuscode:-1,msg:"Some error occured"})
    }
})
app.get("/api/fetchnewprods",async(req,res)=>
    {
        var result = await ProdModel.find().sort({"addedon":-1}).limit(6)
        if(result.length===0)
        {
            res.status(200).send({statuscode:0})
        }
        else
        {
            res.status(200).send({statuscode:1,proddata:result})
        }    
    })
    
    app.get("/api/searchproducts",async(req,res)=>
    {
        var searchtext = req.query.q;
        var result = await ProdModel.find({pname: { $regex: '.*' + searchtext ,$options:'i' }})
        if(result.length===0)
        {
            res.status(200).send({statuscode:0})
        }
        else
        {
            res.status(200).send({statuscode:1,proddata:result})
        }    
    })
    

app.listen(port,()=>
{
    console.log("Server is running on " + port);
})