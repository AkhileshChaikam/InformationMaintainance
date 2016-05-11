var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('userlist');
  collection.find({},{},function(e,docs){
  	res.json(docs);
  });
});


router.post('/adduser', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	collection.insert(req.body, function(err, result) {
		res.send(
			(err === null) ? { msg: '' }: { msg: err }
		);
	});
});

router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	var userToDelete = req.params.id;
	collection.remove({'_id' : userToDelete }, function(err) {
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
	});
});

router.put('/updateuser/:id', function(req, res) {
	var db = req.db;
	var collection = db.get('userlist');
	var userToUpdate = req.params.id;
	collection.update({'_id':userToUpdate},{ $set: req.body }, function(err,result) {
		res.send((err === null) ? {  msg: ''} : { msg:'error: ' + err });
	});
});
module.exports = router;