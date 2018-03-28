var mongodb=require('mongodb');
var mongoose=require('mongoose');
var express=require('express');
var bodyParser=require('body-parser');
var cors=require('cors');
mongoose.Promise=global.Promise;
var app=express();
app.use(cors());
app.use(bodyParser.json());
/*app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Access-Control-*, Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,DELETE,PATCH,PUT');
    next();
})*/
mongoose.connect('mongodb://localhost:27017/adminlogin',(err,db)=>{
    if(err){
        console.log(err);
    }
    else
    {
        //console.log(db);
    }
});
var user=mongoose.model('user',{
    name:{
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
        username:{
            type:String,
            required:true

    },
    password:{
        type:String,
        required:true
    }
});
var newUser=new user();
app.post('/new',(req,res)=>{
    console.log('In Post');
    var newUser=new user({  name:req.body.name,
        city:req.body.city,
        username:req.body.username,
        password:req.body.password});
    newUser.save().then((res)=>{
        console.log('record saved',res);
    },(err)=>{
        console.log('error cannot save',err);
    });
    console.log(res.ops);

});


app.patch('/edit/:id',(req,res)=>{

    user.find().then((response)=>{
        res.send(response);
        console.log(response);
    },(err)=>{

    })

});
app.get('/getOne/:id',(req,res)=>{
        console.log( req.params.id);
    user.findOne({'_id' : req.params.id}).then((response)=>{
        res.send(response);
        console.log(response);
    },(err)=>{

    })

});
app.get('/getall',(req,res)=>{

    console.log('fhvd');
   user.find().then((response)=>{
            res.send(response);
            console.log(response);
   },(err)=>{

   })

});
app.delete('/delete/:id',(req,res)=>{
        var id=req.params.id;
        console.log(id);
       // console.log(new ObjectID(`${req.body.id}`));
    user.findOneAndRemove({'_id' : req.params.id}).then((result)=>{
      //  console.log(req.body.id);
       // console.log(res.ops);
        res.send(result);
    }).catch((err)=>{
       // console.log(err);
    });
    }
);
app.put('/edit/:id',(req,res)=>{
        data=req.body;
        //console.log(id);
        // console.log(new ObjectID(`${req.body.id}`));
    console.log(req.body.name);
        user.findByIdAndUpdate(req.params.id,{$set:{'city':req.body.city,'name':req.body.name}}).then((res)=>{
            //  console.log(req.body.id);
            // console.log(res.ops);
            res.send(res);
        }).catch((err)=>{
            // console.log(err);
        });
        // user.findById(req.params.id)
        //     .then(()=>{
        //
        //     });
    }
);
app.listen(3001,()=>{
    console.log('started on port 3001');
});

