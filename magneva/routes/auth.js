const express = require('express');
const router = express.Router();

function loginCheck(){
    return [
        body()
    ]
}


router.use('/', (req, res, next) => {
    
    next();
})

router.post('/login', (req, res) => {

});
