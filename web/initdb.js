var read = require('read');
var fs = require('fs');

require('dotenv').config();
// connect to the database
require('./app_server/models/db'); 
var QuestionSet = require('./app_server/models/questionSets').questionSetSchema;
var User  = require('./app_server/models/users').User;
var Form  = require('./app_server/models/forms').Form;
var Email = require('./app_server/models/emails').emailSchema;

/*
function readSync(question, silent=false) {
    return new Promise((resolve, reject) => {
       read({prompt: question, silent:silent}, (err, result) => {
            if(err) {
                console.log(err);
                process.exit(1);
            }
            resolve(result);
        });
    });
}
*/

async function run() {
    // Check if database exists
    // TODO better check
    var qsets = await QuestionSet.find().catch((err) => console.log(err));
    if (qsets.length != 0 && process.env['DESTROY'] !== 'true') {
        console.log("Database already exists, not initialising")
        console.log("If clearing the database was intentional rerun with \"DESTROY='true' node initdb.js\"");
        process.exit(0)
    }
    console.log("Initialising database");
    await User.deleteMany().catch((err) => console.log(err));
    await QuestionSet.deleteMany().catch((err) => console.log(err));
    await Form.deleteMany().catch((err) => console.log(err));
    await Email.deleteMany().catch((err) => console.log(err));

    /*var number = await readSync('Enter IT number: ');
    var fname = await readSync('Enter IT first name: ');
    var lname = await readSync('Enter IT last name: ');*/
    var number = "00000000"
    var fname = "Admin"
    var lname = "Admin"
    var password = process.env.IT_PASSWORD
    //var password, password2;
    /*password = await readSync('Enter IT password (will not echo): ', slient=true);
    password2 = await readSync('Enter IT password again: ', slient=true);
    while (password !== password2) {
        console.log("Passwords do not match");
        password = await readSync('Enter IT password (will not echo): ', slient=true);
        password2 = await readSync('Enter IT password again: ', slient=true);
    }*/
    var user = User.create(fname, lname, number)
    user.isIT = true;
    await User.register(user, password).catch((err) => console.log(err));

    var qset = JSON.parse(fs.readFileSync('questionSet.json', 'utf8'));
    for (var i = 0; i<qset.questionList.length; i++)
        qset.questionList[i].order = i;
    var qset = await new QuestionSet(qset).save().catch((err) => console.log(err));

    var answers = [];
    var answers2 = [];
    for (var i=0; i<qset.questionList.length; i++) {
        answers.push({order:i, answer:'foo'});
        answers2.push({order:i, answer:'bar'});
    }
    var submission = await new Form({owner: user._id, answers:answers, status:'Provisionally Approved', dates:[new Date()], school:'School of Engineering', submitter:'Researcher', questionSet:qset._id}).save().catch((err) => console.log(err));
    var approval = await new Form({owner: user._id, answers:answers2, status:'Awaiting HoS', dates:[new Date()], school:'idk', submitter:'it', questionSet:qset._id}).save().catch((err) => console.log(err));
    user.submissions = [submission._id];
    user.approvals = [approval._id];
    await user.save().catch((err) => console.log(err))

    var emails = JSON.parse(fs.readFileSync('emails.json', 'utf8'));
    for (var i=0; i<emails.length; i++)
        await new Email(emails[i]).save().catch((err) => console.log(err))

    process.exit()
}

run();
