import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURI } from '../config';

@Injectable()
export class QuestionService {

    HTTP: HttpClient;

    constructor(private http: HttpClient) {
        this.HTTP = http;
    }

    getData() {
        return this.HTTP.get(baseURI + '/db/questionSet/latest');
    }

    newSubmission(form) {
        return this.http.post<any>(baseURI + '/db/newSubmission', form);
    }

    updateSubmission(form) {
        return this.http.post<any>(baseURI + '/db/updateSubmission', form);
    }
}
