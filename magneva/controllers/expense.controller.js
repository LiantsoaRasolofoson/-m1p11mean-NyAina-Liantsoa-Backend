const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { expenseService } = require('../services');
const { body } = require('express-validator');

function createExpenseCategoryMiddlewares(){
    return [
        body('name').notEmpty().withMessage('Nom requis'),
        requestValidation.check
    ]
}

function createExpenseMiddlewares(){
    return [
        body('date').notEmpty().withMessage('Date requise.'),
        body('amount').isNumeric().withMessage('Montant invalide').custom(value => {
            if (value < 0) {
                throw new Error('Le montant ne peut pas être négatif');
            }
            return true;
        }),
        body('expenseCategory').notEmpty().withMessage('Type dépense requis'),
        requestValidation.check
    ]
}

function expenseMiddlewares(){
    return [
        requestValidation.check
    ]
}

// expense category
router.post("/expenseCategory/create", createExpenseCategoryMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await expenseService.createExpenseCategory(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/expenseCategory/list", expenseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await expenseService.getAllExpenseCategory(req, res));
    }catch(error){
        next(error);
    }
})

// expense
router.post("/create", createExpenseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await expenseService.createExpense(req, res));
    }catch(error){
        next(error);
    }
})

router.get("/list", expenseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await expenseService.getAllExpenses(req, res));
    }catch(error){
        next(error);
    }
})

router.delete("/delete/:expenseID", expenseMiddlewares(), async(req, res, next) => {
    try{
        res.status(200).send(await expenseService.deleteExpense(req, res));
    }catch(error){
        next(error);
    }
})

module.exports = router;