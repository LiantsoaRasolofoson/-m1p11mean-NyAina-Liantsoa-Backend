const HttpError = require("../httperror");
const db = require("../models");
const ExpenseCategory = db.expenseCategory;
const Expense = db.expense;

const isExpenseCategoryExist = async (name) => {
    const regex = new RegExp('^' + name + '$', 'i');
    let expenseCategory = await ExpenseCategory.findOne({ name: { $regex: regex } }).exec();
    return expenseCategory;
}

const createExpenseCategory = async (req, res) => {
    let data = req.body;
    try {
        let expenseCategory1 =  await isExpenseCategoryExist(data.name);
        if( expenseCategory1 !== null ){
            throw new HttpError("Le type de dépense "+data.name+" existe déjà sous le nom "+expenseCategory1.name , 400);
        }
        const expenseCategory = new ExpenseCategory({
            name: data.name,
            type: data.type
        });
        return await expenseCategory.save();
    }
    catch (error) {
        throw error;
    }
};

const getAllExpenseCategory = async (req, res) => {
    try {
        const expenseCategories = await ExpenseCategory.find().exec();
        return expenseCategories;
    }
    catch (error) {
        throw error;
    }
};

const createExpense = async(req, res) => {
    let data = req.body;
    try {
        const expense = new Expense({
            date: data.date,
            amount: data.amount,
            motif: data.motif,
            expenseCategory: data.expenseCategory
        });
        return await expense.save();
    }
    catch (error) {
        throw error;
    }
}

const deleteExpense = async (req, res) => {
    const expenseID = req.params.expenseID;
    try {
        const expense = await Expense.findByIdAndDelete(expenseID);
        if (!expense) {
            throw new HttpError("Cette dépense n'existe pas", 400);
        }
        return await getAllExpenses(req, res);
    } 
    catch (error) {
        throw error;
    }
};

const getAllExpenses = async(req, res) => {
    try {
        let filter = {};
        const { startDate, endDate, expenseCategoryName, expenseCategoryType } = req.query;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            filter.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.date = { $lte: new Date(endDate) };
        }
        if (expenseCategoryName) {
            filter["expenseCategory.name"] = new RegExp(expenseCategoryName, 'i');
        }
        if (expenseCategoryType !== null && expenseCategoryType !== '') {
            const parsedExpenseCategoryType = parseInt(expenseCategoryType);
            if (!isNaN(parsedExpenseCategoryType)) {
                filter["expenseCategory.type"] = parsedExpenseCategoryType;
            }
        }
        const expenses = await Expense.aggregate([
            {
                $lookup: {
                    from: "expensecategories",
                    localField: "expenseCategory",
                    foreignField: "_id",
                    as: "expenseCategory"
                }
            },
            {
                $unwind: "$expenseCategory"
            },
            {
                $match: filter
            },
            {
                $sort: { date: -1 }
            }
        ]);
        return expenses;
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createExpenseCategory,
    getAllExpenseCategory,
    createExpense,
    deleteExpense,
    getAllExpenses
}