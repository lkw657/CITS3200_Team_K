import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';

import { QuestionBase } from '../../classes/question-base';
import { TextboxQuestion } from '../../classes/question-textbox';
import { TextQuestion } from '../../classes/question-text';
import { MoneyQuestion } from '../../classes/question-money';
import { MoneyArrayQuestion } from '../../classes/question_moneyarray';


@Component({
    selector: 'app-submission',
    templateUrl: './submission.component.html',
    styleUrls: ['./submission.component.css'],
    providers: [QuestionService]
})

export class SubmissionComponent implements OnInit {

    questions: any[] = [];
    qset_id: string = '';
    qs: QuestionService;

    constructor(service: QuestionService) { this.qs = service; }
    questionList: any;
    isLoaded = false;

    ngOnInit() {
        this.makeForm();
    }

    makeForm() {
        let qObjs: QuestionBase<any>[] = [];
        this.qs.getData().subscribe(res => {
            this.questionList = res['questionSet']['questionList'];

            let qObjs: QuestionBase<any>[] = [];

            for (let i = 0; i < this.questionList.length; i++) {
                let q = this.questionList[i];

                let field: any;
                if (q['type'] == 'textarea') {
                    qObjs.push(
                        new TextboxQuestion({
                            key: i + 1,
                            label: q.text,
                            required: true,
                            order: q.order,
                            form_name: q.formName
                        })
                    );
                } else if (q['type'] == 'text') {
                    qObjs.push(
                        new TextQuestion({
                            key: i + 1,
                            label: q.text,
                            required: true,
                            order: q.order,
                            form_name: q.formName
                        })
                    );
                } else if (q['type'] == 'money_single') {
                    qObjs.push(
                        new MoneyQuestion({
                            key: i + 1,
                            label: q.text,
                            required: true,
                            order: q.order,
                            form_name: q.formName
                        })
                    );
                } else if (q['type'].indexOf("money_array") == 0) {
                    let number_of_fields = 0;
                    qObjs.push(
                        new MoneyArrayQuestion({
                            key: i + 1,
                            label: q.text,
                            required: true,
                            order: q.order,
                            form_name: q.formName,
                            value: 0,
                            number: parseInt(q['type'].substring(q['type'].length - 1))
                        })
                    );
                }
            }
            this.questions = qObjs.sort((a, b) => a.order - b.order);
            this.qset_id = res['questionSet']['_id'];
            this.isLoaded = true;
        })
    }
}
