import { Component, OnDestroy, OnInit } from "@angular/core";
import { ScripturesAppService } from "../scripturesApp.service";
import { Verse, Work } from "../scripture.model";
import { Observable, Subscription } from "rxjs";

@Component({
    selector: 'tall-random-scripture',
    templateUrl: './randomScripture.component.html',
    styleUrls: ['./randomScripture.component.css']
})
export class RandomScriptureComponent implements OnInit, OnDestroy {
    public randomVerse: Verse;
    public randomVerseChapter$: Observable<string[]>;
    public randomScripture$: Observable<Verse>;
    public work$: Observable<Work>;
    public showChapter: boolean = false;
    public isNerd$: Observable<boolean>;
    public randomVerseNumber: number = 0;
    private subscription: Subscription;

    constructor(
        private scriptureAppService: ScripturesAppService
    ) {}
    ngOnInit(): void {
        this.randomScripture$ = this.scriptureAppService.randomScripture$;
        this.randomVerseChapter$ = this.scriptureAppService.randomChapter$;
        this.work$ = this.scriptureAppService.work$;
        this.isNerd$ = this.scriptureAppService.isNerd$;
        this.subscription = this.scriptureAppService.showChapter$.subscribe(showChapter => { 
            this.showChapter = showChapter;
        });
        this.scriptureAppService.nextRound();

        this.randomScripture$.subscribe(randomScripture => { 
            this.randomVerse = randomScripture;
            this.randomVerseNumber = this.getRandomVerseNumber(randomScripture);
        });
        
    }

    showChapterClicked() { 
        this.scriptureAppService.hasLookedAtChapter();
        this.showChapter = !this.showChapter;
    }

    getRandomVerseNumber(verse: Verse): number {
        if(verse.verse) {
            return verse.verse;
        } else {
            return +verse.reference.split(":")[1];
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}