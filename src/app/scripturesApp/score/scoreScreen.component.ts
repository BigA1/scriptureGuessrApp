import { Component, OnDestroy, OnInit } from "@angular/core";
import { ScripturesAppService } from "../scripturesApp.service";
import { Score, Verse, Work } from "../scripture.model";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'tall-score-screen',
    templateUrl: './scoreScreen.component.html',
    styleUrls: ['./scoreScreen.component.css']
})
export class ScoreScreenComponent implements OnInit, OnDestroy {
 
    public score$: Observable<Score[]>;
    public totalScore$: Observable<number>;
    public dailyChallengeNumber: number = 0;
    public currentWork: Work;
    constructor(
        private scriptureAppService: ScripturesAppService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.score$ = this.scriptureAppService.score$;
        this.totalScore$ = this.scriptureAppService.totalScore$;
        this.dailyChallengeNumber = this.scriptureAppService.dailyChallengeIndex - this.scriptureAppService.dailyChallengeOffset;
        this.currentWork = this.scriptureAppService.work;
    }

    onHome() { 
        this.router.navigate(['/']);
    }

    onShare() {
        const nerd1: string =  this.scriptureAppService.score[0].isNerd ? '🤓' : '';
        const nerd2: string =  this.scriptureAppService.score[1].isNerd ? '🤓' : '';
        const nerd3: string =  this.scriptureAppService.score[2].isNerd ? '🤓' : '';
        const nerd4: string =  this.scriptureAppService.score[3].isNerd ? '🤓' : '';
        const nerd5: string =  this.scriptureAppService.score[4].isNerd ? '🤓' : '';
        const navigator: any = window.navigator;
        const text =  `${this.currentWork.title}
        Daily Challenge ${this.dailyChallengeNumber}
        Round 1: ${this.scriptureAppService.score[0].score} ${nerd1}
        Round 2: ${this.scriptureAppService.score[1].score} ${nerd2}
        Round 3: ${this.scriptureAppService.score[2].score} ${nerd3}
        Round 4: ${this.scriptureAppService.score[3].score} ${nerd4}
        Round 5: ${this.scriptureAppService.score[4].score} ${nerd5}
        Total: ${this.scriptureAppService.totalScore}`
        if(navigator.share) {
            navigator.share({
                title: 'Scripture Guesser',
                text: text,
                url: 'https://scriptureguesser.com'
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        }
    }

    ngOnDestroy(): void {
    }

}