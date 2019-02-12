var MongoClient = require('mongodb').MongoClient; 
var express=require('express');
var bodyParser = require("body-parser");
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(8080);
db=null;
// For cross Origin Issues
var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
	next();
};
app.use(allowCrossDomain);
connect();

function connect(){
	MongoClient.connect("mongodb://localhost:27017/yakstore", function(err, database) { 
		if (err) return false;
		else {
			console.log("Connected to database");
			db = database.db("yakstore");
		}
	});	
}
// For Creating Login Credentials
app.post('/register', function (req, res) {
	db.collection("loginCollection").find({"email":req.body.email}).toArray(function(err, result){
		if(result.length == 0){
			db.collection("loginCollection").insertOne(req.body, function (err, data) {
				return res.status(200).send({
					"message": "User registered successfully!"
				});
			});
		} else {
			return res.status(400).send({
				"message": "User already exists!"
			});
		}
	});
});
// For Validating Login Credentials
app.post('/login', function (req, res) {
	db.collection("loginCollection").find({"email":req.body.email,"password":req.body.password}).toArray(function (err, data) {
		if(data.length == 1){
			return res.status(200).send({
				"message": "User verified successfuly!",
				"user": data[0]
			});
		} else {
			return res.status(400).send({
				"message": "Invalid Email/password!"
			});
		}
	});
});
// For loading herd into the webshop.
app.post('/yak-shop/load', function (req, res) {
	var herdDetails = req.body;
	for(var i=0; i<herdDetails.length;i++){
		herdDetails[i]["age-last-shaved"] = herdDetails[i]["age"];
	}
	db.collection("herdCollection").deleteMany({});
	db.collection("herdCollection").insertOne({"herd": herdDetails, "uploadedDate": new Date().getTime()}, function (err, data) {
		if (data) {
			return res.status(205).send({
				"message": "Herd loaded successfuly!",
				"herdDetails": data
			});
		} else {
			return res.status(400).send({
				"message": "Error loading herd!"
			});
		}
	});
});
// For retrieving existing herd details.
app.get('/yak-shop/herd/:days', function (req, res) {
	var days = req.url.split("/");
	var daysElapsed = days[days.length] - 1;
	db.collection("herdCollection").find().toArray(function (err, data) {
		if (data.length != 0) {
			if (daysElapsed != 0){
				for (var i=0; i< data[0].herd.length; i++) {
					// skin calculation
					var shavedInterval = 8 + (Number(data[0]["herd"][i].age) * 100 * 0.01);
					var numOfShavesAfterUpload = Math.floor((days[days.length - 1]) / shavedInterval);
					data[0].herd[i]["age-last-shaved"] = ((Number(data[0]["herd"][i].age) * 100) + (shavedInterval * numOfShavesAfterUpload))/100;
				}
			}
			return res.status(200).send({
				"message": "Herd details retrived successfuly!",
				"herdDetails": data[0]
			});
		} else {
			return res.status(400).send({
				"message": "Error retrieving herd details!",
				"herdDetails": data[0]
			});
		}
	});
});
// To get the stock status
app.get('/yak-shop/stock/:days', function (req, res) {
	var days = req.url.split("/");
	db.collection("herdCollection").find().toArray(function (err, data) {
		if (data) {
			// calculate the stock.
			var milkStock = 0;
			var skinStock = 0;
			for(var i=0; i<data[0]["herd"].length;i++){
				if (Number(data[0]["herd"][i].age) >= 1 && Number(data[0]["herd"][i].age) <= 10){
					skinStock += 1; // default skin which we obtain on Day 0(when herd was uploaded into the store.)
				}
				// skin calculations.
				var shavedInterval = 8 + (Number(data[0]["herd"][i].age) * 100 * 0.01);
				var numOfShavesAfterUpload = Math.floor((days[days.length - 1]) / shavedInterval);
				var percentileDays = (days[days.length - 1]) % shavedInterval;
				if (percentileDays >= 1){
					skinStock += numOfShavesAfterUpload;
				} else {
					skinStock += numOfShavesAfterUpload - 1;
				}
				// milk calculations.
				var perDayMilk = 50 - (Number(data[0]["herd"][i].age) * 100)*0.03;
				var tillDateStock = (days[days.length - 1]) * perDayMilk;
				milkStock += tillDateStock;
				// reduce orders
				var milkOrders = 0;
				var skinOrders = 0;
				db.collection("orderCollection").find().toArray(function (err, data) {
					for(var x=0;x<data.length;x++){
						milkOrders += data[x].order.milk;
						skinOrders += data[x].order.skins;
					}
					return res.status(200).send({
						"milk": milkStock - milkOrders,
						"skins": skinStock - skinOrders
					});
				});
			}
		} else {
			return res.status(400).send({
				"message": "Error loading stock!"
			});
		}
	});
});
// To place the order
app.post('/yak-shop/order/:days', function (req, res) {
	// perform get status of stock call and save the stock values and based on order values form the req object and do post call.
	// create orders table and insert a document into it.
	var days = req.url.split("/");
	db.collection("herdCollection").find().toArray(function (err, data) {
		if (data) {
			// calculate the stock.
			var milkStock = 0;
			var skinStock = 0;
			for (var i = 0; i < data[0]["herd"].length; i++) {
				if (Number(data[0]["herd"][i].age) >= 1 && Number(data[0]["herd"][i].age) <= 10) {
					skinStock += 1; // default skin which we obtain on Day 0(when herd was uploaded into the store.)
				}
				// skin calculations.
				var shavedInterval = 8 + (Number(data[0]["herd"][i].age) * 100 * 0.01);
				var numOfShavesAfterUpload = Math.floor((days[days.length - 1]) / shavedInterval);
				var percentileDays = (days[days.length - 1]) % shavedInterval;
				if (percentileDays >= 1) {
					skinStock += numOfShavesAfterUpload;
				} else {
					skinStock += numOfShavesAfterUpload - 1;
				}
				// milk calculations.
				var perDayMilk = 50 - (Number(data[0]["herd"][i].age) * 100) * 0.03;
				var tillDateStock = (days[days.length - 1]) * perDayMilk;
				milkStock += tillDateStock;
				// reduce orders
				var milkOrders = 0;
				var skinOrders = 0;
				db.collection("orderCollection").find().toArray(function (err, data) {
					for (var x = 0; x < data.length; x++) {
						milkOrders += data[x].order.milk;
						skinOrders += data[x].order.skins;
					}
					milkStock =  milkStock - milkOrders;
					skinStock = skinStock - skinOrders;
					//logic for order placing.
					console.log("Getting stock while placing order: " + milkStock + ", " + skinStock);
					//forming the updatedRequest object.
					var newReqOrderObj = { "customer": req.body.customer, "order": { "milk": req.body.order.milk, "skins": req.body.order.skins } };
					if (req.body.order.milk > milkStock) {
						newReqOrderObj["order"]["milk"] = 0;
					}
					if (req.body.order.skins > skinStock) {
						newReqOrderObj["order"]["skins"] = 0;
					}
					var orderType;
					if ((req.body.order.milk == 0 || req.body.order.milk > milkStock) && (req.body.order.skins == 0 || req.body.order.skins > skinStock)) {
						orderType = "nil";
					} else if (req.body.order.milk > milkStock || req.body.order.skins > skinStock) {
						orderType = "partial";
					} else {
						orderType = "full";
					}
					db.collection("orderCollection").insertOne(newReqOrderObj, function (err, data) {
						if (data) {
							if (orderType == "full") {
								return res.status(201).send({
									"message": "Order placed successfuly!",
									"orderDetails": newReqOrderObj
								});
							} else if (orderType == "partial") {
								return res.status(206).send({
									"message": "Partial order placed successfuly!",
									"orderDetails": newReqOrderObj
								});
							} else {
								return res.status(404).send({
									"message": "Order not placed due to stock unavailability.!",
									"orderDetails": newReqOrderObj
								});
							}
						}
					})
				});
			}
		} else {
			return res.status(400).send({
				"message": "Error placing order!"
			});
		}
	});
});