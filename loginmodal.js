var mongoose=require('mongoose');
var validator=require('validator');
var jwt=require('jsonwebtoken');
var bcrypt=require('bcryptjs');
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        trim:true,
    },
    city:{
        type:String,
        required:true,
        minlength:5,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        minlength:5,
        trim:true,
        unique:true,
        validate:{validator:validator.isEmail,
            message  :`Email is not a valid email`  }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]


});
// UserSchema.methods.toJSON=function(){
//     var user=this;
//     var userObject=user.toObject();
//     var data={username:userObject.username,_id:userObject._id};
//     return data;
// }

UserSchema.statics.findByCredentials=function(username,password){
    var user=this;
    return user.findOne({username}).then((u)=>{
        if(!u){
            return new Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,u.password,(err,res)=>
            {
                if(res)
                {
                    resolve(u);
                }
                else{
                    reject();
                }
            });
        })
    })
}
UserSchema.methods.removeByToken=function(token){
    var user=this;
    return user.update(
        {$pull:{tokens:{token}}}
    );
}

UserSchema.methods.generateAuthToken = function () {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123',{expiresIn:'2h'}).toString();
    console.log(token);
    user.tokens.push({access,token});
    console.log("in auth");
    user.save().then(() => {
        console.log("Token",token);
        return token;
    });

};
UserSchema.statics.findByToken=function(token){
    var user=this;
    var decode;
    try{
        decode=jwt.verify(token,'abc123');``
    }catch(e){
        return new Promise((resolve,reject)=>{
            reject();
        })
    }
    return user.findOne({
        _id:decode._id
    });
}
UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            })
        })
    }
    else
    {
        next();
    }

});

var users=mongoose.model('users',UserSchema);
module.exports={users};