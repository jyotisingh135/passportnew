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
    statename:{
        type:String,
        required:true,
        trim:true,
    },
    cityname:{
        type:String,
        required:true,
        trim:true,
    }
});
var cities=mongoose.model('cities',UserSchema);
module.exports={cities};