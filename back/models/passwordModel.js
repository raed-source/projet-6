const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                   
.is().max(20)                                  
// .has().uppercase(1)                           
.has().lowercase()                              
// .has().symbols(1)
.has().digits(1) 
// .is().not(/[\]()'"[{}<>@]/)                              
.has().not().spaces()                           
// .is().not().oneOf(['Passw0rd', 'Password123']);


module.exports = passwordSchema;