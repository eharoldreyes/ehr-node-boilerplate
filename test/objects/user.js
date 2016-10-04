/**
 * Created by eharoldreyes on 3/10/16.
 */

const utils 	= require(__dirname + "/../../helpers/utils");
const files 	= require(__dirname + "/../files");
module.exports = function () {
    let lastName = utils.generateWord();
    let firstName = utils.generateWord();
    return {
        firstName:firstName,
        lastName:lastName,
        middleName: utils.generateWord(),
        email: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${utils.randomInt(1, 31)}@codemagnus.com`,
        password:utils.generateWords(1) + utils.generateWords(1) + utils.generateWords(1),
        phone: "09" + utils.randomInt(10, 35) + "" + utils.randomInt(100, 999) + "" + utils.randomInt(1000, 9999),
        birthday:`${utils.randomInt(1,31)}-${utils.randomInt(1,12)}-${utils.randomInt(1980, 2000)}`,
        hiredAt:`${utils.randomInt(1,31)}-${utils.randomInt(1,12)}-${utils.randomInt(1980, 2000)}`
    }
};