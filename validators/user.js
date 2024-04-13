let { check } = require('express-validator');
let util = require('node:util')
let option = {
    password: {
        minLength: 6,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    },
    fullName: {
        max: 100,
        min: 6
    }
}
module.exports = {
    checkChain: function () {
        return [
            check("password", util.format("password phai dai it nhat %d ki tu, %d chu in hoa, %d chu thuong,%d so", option.password.minLength, option.password.minSymbols, option.password.minUppercase, option.password.minLowercase, option.password.minNumbers)).isStrongPassword(option.password),
            check('email', "email dung dinh dang").isEmail(),
            check('fullName', "Ho ten phai dai tu %d den %d ki tu").isLength(option.fullName),
            // check('role', "role khong hop le").isIn(["user", "admin", "publisher"])
        ]
    },
    checkStrongPassword: function () {
        return check("password", util.format("password phai dai it nhat %d ki tu, %d chu in hoa, %d chu thuong,%d so", option.password.minLength, option.password.minSymbols, option.password.minUppercase, option.password.minLowercase, option.password.minNumbers)).isStrongPassword(option.password)
    },
    checkIsEmail: function () {
        return check('email', "email dung dinh dang").isEmail()
    }
}