import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Verse } from "../scripture.model";
import { ScripturesAppService } from "../scripturesApp.service";
import { Observable, take } from "rxjs";
import { Router } from "@angular/router";

@Component({
  templateUrl: './scoreDialog.component.html',
  styleUrls: ['./scoreDialog.component.css']
})
export class ScoreDialogComponent implements OnInit, OnDestroy{
  constructor(@Inject(MAT_DIALOG_DATA) public data: {distance: number, verse: Verse},
    public scriptureAppService: ScripturesAppService,
    private router: Router
  ) {}

    public score: number = 0;
    public randomScripture$: Observable<Verse>;
    public totalScore: number = 0;
    public round: number = 0;
    public buttonText: string = "Next Round";
    private isLastRound: boolean = false;
    public isNerd$: Observable<boolean>;

    ngOnInit(): void { 
        this.round = this.scriptureAppService.round;
        this.score = this.scriptureAppService.calculateScore(this.data.distance);
        this.scriptureAppService.updateScore(this.score);
        this.randomScripture$ = this.scriptureAppService.randomScripture$;
        this.totalScore = this.scriptureAppService.totalScore;
        this.isLastRound = this.round == this.scriptureAppService.numberOfRounds;
        this.isNerd$ = this.scriptureAppService.isNerd$;
        if(this.isLastRound) {
            this.buttonText = "Finish";
        }
    }

    ngOnDestroy(): void { 
        if(this.isLastRound) {
            this.router.navigate(['/score']);
        } else {
            this.scriptureAppService.nextRound();
        }
    }
}