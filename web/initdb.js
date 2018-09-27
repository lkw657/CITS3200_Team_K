var read = require('read');
var fs = require('fs');

require('dotenv').config();
// connect to the database
require('./app_server/models/db'); 
var QuestionSet = require('./app_server/models/questionSets').questionSetSchema;
var User  = require('./app_server/models/users').User;
var Form  = require('./app_server/models/forms').Form;

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

async function run() {
    await User.deleteMany().catch((err) => console.log(err));
    await QuestionSet.deleteMany().catch((err) => console.log(err));

    var number = await readSync('Enter IT number: ');
    var fname = await readSync('Enter IT first name: ');
    var lname = await readSync('Enter IT last name: ');
    var password, password2;
    password = await readSync('Enter IT password (will not echo): ', slient=true);
    password2 = await readSync('Enter IT password again: ', slient=true);
    while (password !== password2) {
        console.log("Passwords do not match");
        password = await readSync('Enter IT password (will not echo): ', slient=true);
        password2 = await readSync('Enter IT password again: ', slient=true);
    }
    var user = User.create(fname, lname, number)
    user.isIT = true;
    await User.register(user, password).catch((err) => console.log(err));

    qset = JSON.parse(fs.readFileSync('questionSet.json', 'utf8'));
    for (var i = 0; i<qset.questionList.length; i++)
        qset.questionList[i].order = i;
    qset = await new QuestionSet(qset).save().catch((err) => console.log(err));

    answers = []
    answers2 = []
    for (var i=0; i<qset.questionList.length; i++) {
        answers.push({order:i, answer:"foo"});
        answers2.push({order:i, answer:"bar"});
    }
    var submission = await new Form({owner: user._id, dates:[new Date()], questionSet: qset, answers: answers, status:'awaiting-hos', school:'idk', submitter:'researcher'}).save().catch((err) => console.log(err));
    var approval = await new Form({owner: user._id, dates:[new Date()], questionSet: qset, answers: answers2, status:'awaiting-hos', school:'idk', submitter:'researcher'}).save().catch((err) => console.log(err));
    user.submissions = [submission._id]
    user.approvals = [approval._id]
    await user.save().catch((err) => console.log(err));

    process.exit()
}

run();
