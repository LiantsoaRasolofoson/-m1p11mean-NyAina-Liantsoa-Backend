const db = require("../models");
const User = db.user;
const Role = db.role;
const ROLES = db.ROLES;
var bcrypt = require("bcryptjs")

const signIn = (req, res) => {
    res.status(200).send(req.matchedData)
}

const isDuplicateEmail = async (email) => {
    let user = await User.findOne({email: email}).exec();
    return user == null ? false : true;
}

const doesRoleExist = (roles) => {
    if(roles.length == 0){
        return false;
    }
    for (let i = 0; i < roles.length; i++) {
        if (!ROLES.includes(roles[i])) {
            return false
        }
    }
    return true; 
};

const signUp = async (req, res) => {
    let data = req.body;

    const user = new User({
        name: data.name,
        firstName: data.firstName,
        sex: data.sex,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8) ,
        contact: data.contact
    });

    try{
        if(await isDuplicateEmail(user.email)){
            console.log(isDuplicateEmail(user.email))
            return res.status(400).send({error: "Mail deja utilise"});
        }
        if(!doesRoleExist(data.roles)){
            return res.status(400).send({error: "Ce role n'existe pas" })
        }

        let roles;
        await user.save();
        roles = await Role.find({name: { $in: data.roles } }).exec();
        user.roles = roles.map(role => role._id);
        await user.save();
        res.status(201).send(user);

    } catch(err) {
        res.status(400).send({ error: err.message })
    }
}

module.exports = {
    signIn,
    signUp
}