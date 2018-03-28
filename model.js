var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/testdemo',(err,db)=>{
    if(err){
        console.log(err);
    }
    else
    {
        console.log('connected');
    }
});
var UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    state:{
        type:String,
        required:true,
        trim:true,
     }
    ,
    city: {
        type: String,
        required: true,

    },
    email:{
        type: String,
        required: true,
        minlength: 6
        },
    delflag:{
        type:Boolean,
        required:true
    }

});
var users=mongoose.model('users',UserSchema);
module.exports={users};