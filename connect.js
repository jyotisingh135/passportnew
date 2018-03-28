var express=require('express');
var passport=require('passport');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var localStratergy=require('passport-local').Strategy;
var {users} =require('./loginmodal.js');
var authenticate=require('./authenticate.js');
mongoose.connect('mongodb://localhost:27017/adminlogin');
let jwt=require('jsonwebtoken');
global.token='';
mongoose.Promise = global.Promise;
var cors=require('cors');
var app=express();
app.use(bodyParser.json());
app.use(cors());
var user=new users();
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.use(new localStratergy((username,password,done)=>{
    users.findOne({username:username},(err,user)=>{
        if(err){return done(err);}
        if(!user){return done(null,false,{message:'incorrect user'});}
        else{
            var access = 'auth';
            token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123',{expiresIn:'2h'}).toString();
            return done(null,user);
        }


    });
}));
app.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/fail'}));
app.get('/',(req,res)=>{
    res.send({'token':token});
})
app.post('/register',(req,res)=>{
console.log("in post new");
    var user=new users({
        name:req.body.name,
        city:req.body.city,
        username:req.body.username,
        password:req.body.password
    });
    user.save().then((user) => {
        res.send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});
app.get('/getdata',authenticate,(req,res)=>{
    users.find({}).then((result)=>{
        res.send(result);
    })
})
app.get('/new',authenticate,(req,res)=>{

    res.send(req.user);

});
app.get('/new/me1',(req,res)=>{
    console.log('get');

});

app.post('/home/login',(req,res)=>{
    console.log('login');

users.findByCredentials(req.body.username,req.body.password).then((u)=>{
    res.send(u);
}).catch((e)=>{
    res.status(400).send();
    })

});
app.delete('/logout',authenticate,(req,res)=>{

    req.u.removeByToken(req.token).then((result)=>{

            res.status(200).send();
    }).catch((e)=>{
        res.status(401).send();
    })

})
app.listen(3001,()=>{
    console.log('stareted on port 3001');
})