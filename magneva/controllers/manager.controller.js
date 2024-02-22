const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService } = require('../services');

// Employe
function employeeMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/employee/create", employeeMiddlewares(), (req, res, next) => {
    employeeService.createEmployee(req, res, next);
})

router.get("/employee/list", employeeMiddlewares(),  (req, res, next) => {
    employeeService.getAllEmployees(req, res, next);
})

router.get("/employee/detail/:employeeID", employeeMiddlewares(), (req, res, next) => {
    employeeService.getEmployee(req, res, next);
})

module.exports = router;