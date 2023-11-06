var express = require("express");
var router = express.Router();
const multer = require("multer");
const {Post} = require("../Model/Post.js");
const {Counter} = require("../Model/Counter.js");
const {User} = require("../Model/User.js");

router.post("/submit", (req, res) => {


  ////////////////////////




  ////////////////////////




    let temp = {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
    };
    Counter.findOne({name: "counter"}).exec().then((counter) => {
      console.log("Test2022");
      temp.postNum = counter.postNum;
      User.findOne({uid : req.body.uid})
      .exec()
      .then((userInfo) => {
        temp.author = userInfo._id;

        console.log(temp);
      const CommunityPost = new Post( temp);
      CommunityPost.save().then(() => {
        Counter.updateOne({name: "counter"}, {$inc: {postNum : 1}}).then(() => {
          res.status(200).json({ success: true});
        }
        ); 
        
      });
      });
      
      

    })
    .catch((err) => {
      res.status(400).json({success: false});
    
    });//두개의 서버를 돌려야 잘된다. 안되면 오류가 난다.
    
  });



  router.post('/list', (req, res) =>{

    console.log("먼저진입");

    //const posts =  Post.find();
    //console.log(posts);

    let sort ={};
    if (req.body.sort === "최신순"){
      sort.createdAt = -1;
    }else{
      //인기순
      sort.repleNum = -1;
    }
  
    Post.find({
      $or: [
        {title: {$regex : req.body.searchTerm}},
       {content: {$regex : req.body.searchTerm}},
      ],
    })
    .populate("author").sort(sort).exec().then((doc)=>{
      console.log("성공");
      res.status(200).json({ success: true, postList : doc})
    }).catch((err)=>{
      console.log("실패");
      res.status(400).json({ success: false})
    })
  });


  router.post('/detail', (req, res) =>{

    console.log("먼저진입");

    //const posts =  Post.find();
    //console.log(posts);


  
    Post.findOne({postNum : Number(req.body.postNum)})
    .populate("author").exec().then((doc)=>{
      console.log("doc");
      res.status(200).json({ success: true, post : doc})
    }).catch((err)=>{ 
      console.log("실패");
      res.status(400).json({ success: false})
    })
  });


  
  // app.post("/api/post/list", (req, res) => {
  //   Post.find()
  //   .exec()
  //   .then((doc) => {
  //     res.status(200).json({success: true, postList: doc});
  //   })
  //   .catch((err) => {
  //     res.status(400).json({success:false});
  //   });
  // });



  router.post('/edit', (req, res) =>{
    let temp ={
      title: req.body.title,
      content: req.body.content,
    }
    console.log("먼저진입");

    //const posts =  Post.find();
    //console.log(posts);


  
    Post.updateOne({postNum : Number(req.body.postNum)}, {$set:temp}).exec().then(()=>{
      console.log("doc");
      res.status(200).json({ success: true});
    }).catch((err)=>{ 
      console.log("실패");
      res.status(400).json({ success: false});
    })
  });


  router.post('/delete', (req, res) =>{

    console.log("먼저진입");

    //const posts =  Post.find();
    //console.log(posts);


  
    Post.deleteOne({postNum : Number(req.body.postNum)}).exec().then(()=>{
      res.status(200).json({ success: true});
    }).catch((err)=>{ 
      console.log("실패");
      res.status(400).json({ success: false});
    })
  });


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'image/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname );
    },
  });
  
  const upload = multer({ storage: storage }).single("file");

    router.post("/image/upload", (req, res) => {
      upload(req, res, (err) => {
        if(err) {
          console.log(err);
         // res.status(400).json({ success : false});
        }else{
          res.status(200).json({success: true, filePath : res.req.file.path});
        }
      });
      //console.log(req.body, req.formData);
    });
module.exports = router;
