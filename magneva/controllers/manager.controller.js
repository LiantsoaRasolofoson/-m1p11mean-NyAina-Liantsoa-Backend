const router = require("express").Router();
const { requestValidation } = require('../middlewares');
const { employeeService } = require('../services');

// Employe
function employeeMiddlewares(){
    return [
        requestValidation.check
    ]
}

router.post("/employee/create", employeeMiddlewares(), (req, res) => {
    employeeService.createEmployee(req, res);
})

router.get("/employee/list", employeeMiddlewares(),  (req, res) => {
    employeeService.getAllEmployees(req, res);
})

router.get("/employee/detail/:employeeID", employeeMiddlewares(), (req, res) => {
    employeeService.getEmployee(req, res);
})

module.exports = router;