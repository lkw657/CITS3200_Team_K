import { Injectable } from '@angular/core';
import { QuestionBase } from '../classes/question-base';
import { TextboxQuestion } from '../classes/question-textbox';
import { MoneyQuestion } from '../classes/question-money';

@Injectable()
export class QuestionService {
    getQuestions() {
        let questions : QuestionBase<any> [] = [
            new TextboxQuestion({
                key: 'FacultyStrategicVision',
                label: 'Provide a brief statement outlining how your proposal aligns with the Faculty\'s Strategic Vision.',
                required : true,
                order: 1
            }),
            new TextboxQuestion({
                key: 'FacultyStrategicResearchPriorities',
                label: 'Provide a brief statement outlining how your proposal aligns with the Faculty\' strategic research priorities ( Engineering for Remote Operations, Science of Discovery or Technologies for Better Health ) or an emerging strategic research priority',
                required : true,
                order: 2
            }),
            new TextboxQuestion({
                key: 'ReturnOnInvestment',
                label: 'Please provide a brief statement as to how this investment will return value to the Faculty.',
                required : true,
                order: 3
            }),
            new TextboxQuestion({
                key: 'AdditionalInformation',
                label: 'Please use this space to provide pertinent information that cannot fit elsewhere.',
                required : true,
                order: 3
            }),
            new MoneyQuestion({
                key: 'Money',
                label: 'How much money do you require?',
                required : true,
                order: 4
            }),
        ];

        return questions.sort((a,b) => a.order - b.order);
     }
}