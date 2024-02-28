const HttpError = require("../httperror");
const db = require("../models");
const Appointment = db.appointment;
const ExpenseView = db.expenseView;
const PurchaseView = db.purchaseView;
const StatAppointment = db.statAppointment;
const Payment = db.payment;
const ChiffreAffaire = db.chiffreAffaire;

const generateDateArray = (dateDebut, dateFin) => {
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
};


const nbAppointmentInOneDay = async (date) => {
    try{
        const appointments = await Appointment.find({date: date}).exec();
        return appointments.length;
    }
    catch (error) {
        throw error;
    }
}

const statAppointmentInOneDay = async (req, res) => {
    let data = req.body;
    try{
        const stats = [];
        const dates = generateDateArray(data.startDate, data.endDate);
        for (const date of dates) {
            let nb = await nbAppointmentInOneDay(date);
            let stat = {
                date: date,
                nb: nb
            };
            stats.push(stat);
        }
        return stats;
    }
    catch (error) {
        throw error;
    }
}

const statAppointment = async (req, res) => {
    let data = req.body;
    try{
        const lists = await StatAppointment.find({year: data.year}).exec();
        const stats = allMois().map(month => {
            const stat = lists.find(list => list.month === month.month);
            return {
                month: month.month,
                monthName: month.monthName,
                nb: stat ? stat.nb : 0
            };
        });
        return stats;
    }
    catch (error) {
        throw error;
    }
}

const chiffreAffaireDayInOneDay = async (date) => {
    try{
        let ca = 0;
        const payments = await Payment.find({date: date}).exec();
        payments.forEach( payment  => {
            ca += payment.amount;
        });
        return ca;
    }
    catch (error) {
        throw error;
    }
}

const chiffreAffaireDay = async (req, res) => {
    let data = req.body;
    try{
        const stats = [];
        const dates = generateDateArray(data.startDate, data.endDate);
        for (const date of dates) {
            let ca = await chiffreAffaireDayInOneDay(date);
            let stat = {
                date: date,
                ca: ca
            };
            stats.push(stat);
        }
        return stats;
    }
    catch (error) {
        throw error;
    }
}

const allMois = () => {
    return [
        {"month": 1, "monthName": "Janvier"},
        {"month": 2, "monthName": "Février"},
        {"month": 3, "monthName": "Mars"},
        {"month": 4, "monthName": "Avril"},
        {"month": 5, "monthName": "Mai"},
        {"month": 6, "monthName": "Juin"},
        {"month": 7, "monthName": "Juiller"},
        {"month": 8, "monthName": "Août"},
        {"month": 9, "monthName": "Septembre"},
        {"month": 10, "monthName": "Octobre"},
        {"month": 11, "monthName": "Novembre"},
        {"month": 12, "monthName": "Décembre"}
    ]
}

const chiffreAffaire = async (year) => {
    try {
        const chiffres = await ChiffreAffaire.find({year: year}).exec();
        console.log(chiffres);
        const cas = allMois().map(month => {
            const monthCa = chiffres.find(chiffre => chiffre.month === month.month);
            return {
                month: month.month,
                monthName: month.monthName,
                ca: monthCa ? monthCa.ca : 0,
                year: year
            };
        });
        return cas;
    }
    catch (error) {
        throw error;
    }
}

const allDepenses = async (year) => {
    try {
        const expenses = await ExpenseView.find({year: year}).exec();
        const purchases = await PurchaseView.find({year: year}).exec();
        const depenses = allMois().map(month => {
            const monthExpense = expenses.find(expense => expense.month === month.month);
            const monthPurchase = purchases.find(purchase => purchase.month === month.month);
            let amountExpense = monthExpense ? monthExpense.amount : 0;
            let amountPurchase = monthPurchase ? monthPurchase.amount : 0;
            let amount = amountExpense + amountPurchase;
            return {
                month: month.month,
                monthName: month.monthName,
                amount: amount,
                year: year
            };
        });
        return depenses;
    }
    catch (error) {
        throw error;
    }
}

const profit = async (req, res) => {
    try{
        const depenses = await allDepenses(req.body.year);
        const chiffres = await chiffreAffaire(req.body.year);
        const profit = [];
        for (let i = 0; i < depenses.length; i++) {
            const benefice = chiffres[i].ca - depenses[i].amount;
            let p = {
                month: chiffres[i].month,
                monthName: chiffres[i].monthName,
                profit: benefice
            };
            profit.push(p);
        }
        return profit;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    statAppointmentInOneDay,
    statAppointment,
    chiffreAffaireDay,
    chiffreAffaire,
    profit,
    allDepenses
}
