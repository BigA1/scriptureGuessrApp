import { Component, OnDestroy, OnInit } from "@angular/core";
import { ScripturesAppService } from "../scripturesApp.service";
import { MatDialog } from "@angular/material/dialog";
import { ScoreDialogComponent } from "../score/scoreDialog.component";
import { Book, Chapter, Verse, Work } from "../scripture.model";

@Component({
    selector: 'tall-scripture-selector',
    templateUrl: './scriptureSelector.component.html',
    styleUrls: ['./scriptureSelector.component.css']
})
export class ScriptureSelectorComponent implements OnInit, OnDestroy {
    public work: Work;
    public books: Book[];
    public chapters: Chapter[];
    public verses: Verse[];
    public showBookSelection: boolean = true;
    public showChapterSelection: boolean = false;
    public showVerseSelection: boolean = false;
    public currentBookSelection: string;
    public currentChapterSelection: string;

    constructor(
        private scriptureAppService: ScripturesAppService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.work = this.scriptureAppService.work;
        this.books = this.work.books;
        this.scriptureAppService.randomScripture$.subscribe((verse) => { 
            this.reset();
        });
    }

    public onBookSelected(book: Book) {
        this.chapters = book.chapters;
        this.showChapterSelection = true;
        this.showBookSelection = false;
        this.currentBookSelection = book.book;
       }

    public onChapterSelected(chapter: Chapter) {
        this.verses = chapter.verses;
        this.showVerseSelection = true;
        this.showChapterSelection = false;
        this.currentChapterSelection = chapter.chapter.toString();
    }

    public onVerseSelected(verse: Verse) {
        let distance = this.scriptureAppService.getDistanceFromRandomScripture(verse);
        const dialogRef = this.dialog.open(ScoreDialogComponent, {data: {distance: distance, verse: verse}});
        dialogRef.afterClosed().subscribe(result => { 
            this.scriptureAppService.closeChapter();
            window.scroll({ 
                top: 0, 
                left: 0, 
                behavior: 'smooth' 
         });
        });
    }

    public onBack() {
        if(this.showVerseSelection) {
            this.showVerseSelection = false;
            this.showChapterSelection = true;
            this.currentChapterSelection = null;
        } else if(this.showChapterSelection) {
            this.showChapterSelection = false;
            this.showBookSelection = true;
            this.currentBookSelection = null;
        }
    }

    public reset() {
        this.showBookSelection = true;
        this.showChapterSelection = false;
        this.showVerseSelection = false;
        this.currentBookSelection = null;
        this.currentChapterSelection = null;
    }

    ngOnDestroy(): void {
    
    }

}