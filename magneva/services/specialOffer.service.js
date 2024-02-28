const HttpError = require("../httperror");
const db = require("../models");
const User = db.user;
const Role = db.role;
const SpecialOffer = db.specialOffer;
const { sendEmail } = require("./email.service");

const getAllClients = async (req, res) => {
    try {
        const role = await Role.findOne({ name: "user" }).exec();
        const clients = await User.find({ roles: role._id }).exec();
        return clients;
    }
    catch (error) {
        throw error;
    }
}

const sendMailToClients = async (req, res) => {
    try{
        const specialOffer = await getSpecialOffer(req, res);
        text = "<p>Cher Client, </p><br/>";
        text += specialOffer.description+"<br/>";
        text += "<p>Cordialement, </p><br/><p><span>Magneva </span></p>";
        const clients = await getAllClients(req, res);
        clients.forEach( (client)  => {
            to = client.email;
            subject = "MAGNEVA: Offre Spéciale!";
            text = text;
            sendEmail(to, subject, text);
        });
        return true;
    }
    catch(error){
        throw error;
    }
}

const createSpecialOffer = async (req, res) => {
    let data = req.body;
    try {
        const specialOffer = new SpecialOffer({
            service: data.service,
            percentage: data.percentage,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate
        });
        await specialOffer.save();
        return specialOffer; 
    } 
    catch (error) {
        throw error;
    }
};

const getSpecialOffer = async (req, res) => {
    const specialOfferID = req.params.specialOfferID;
    try {
        const specialOffer = await SpecialOffer.findOne({ _id: specialOfferID})
        .populate('service')
        .exec();
        if(!specialOffer) {
            throw new HttpError("Cette offre n'existe pas" , 404);
        }
        return specialOffer;
    }
    catch (error) {
        throw error;
    }
}

const getAllSpecialOffer = async (req, res) => {
    try {
        const offers = await SpecialOffer.find().populate('service').exec();
        return offers;
    }
    catch (error) {
        throw error;
    }
}

const deleteSpecialOffer = async (req, res) => {
    const specialOfferID = req.params.specialOfferID;
    try {
        const offer = await SpecialOffer.findByIdAndDelete(specialOfferID);
        if (!offer) {
            throw new HttpError("Cette offre n'existe pas", 400);
        }
        return await getAllSpecialOffer(req, res);
    } 
    catch (error) {
        throw error;
    }
};

module.exports = {
    createSpecialOffer,
    getSpecialOffer,
    getAllSpecialOffer,
    deleteSpecialOffer,
    sendMailToClients
}
