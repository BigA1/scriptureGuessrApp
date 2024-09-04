import * as bookOfMormon from '../scriptures/book-of-mormon.json';
import * as bookOfMormonFlat from '../scriptures/book-of-mormon-flat.json';
import * as doctrineAndCovenants from '../scriptures/doctrine-and-covenants.json';
import * as doctrineAndCovenantsFLat from '../scriptures/doctrine-and-covenants-flat.json';
import * as newTestament from '../scriptures/new-testament.json';
import * as newTestamentFlat from '../scriptures/new-testament-flat.json';
import * as oldTestament from '../scriptures/old-testament.json';
import * as oldTestamentFlat from '../scriptures/old-testament-flat.json';
import * as pearlOfGreatPrice from '../scriptures/pearl-of-great-price.json';
import * as pearlOfGreatPriceFlat from '../scriptures/pearl-of-great-price-flat.json';

import { Injectable, OnInit } from '@angular/core';
import {
  Book,
  Challenge5,
  ChallengeSet,
  Chapter,
  Score,
  Verse,
  Work,
  WorkFlat,
} from './scripture.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { PrngService } from './prng.service';

@Injectable({ providedIn: 'root' })
export class ScripturesAppService {
  constructor(private prngService: PrngService) {}

  private dailyChallenge: Challenge5;

  public randomScripture: Verse;
  public workFlat: WorkFlat = bookOfMormonFlat;
  public work: Work = bookOfMormon;
  public max;
  public min = 0;
  public totalScore: number = 0;
  public round: number = 1;
  public numberOfRounds: number = 5;
  public allWorks: Work[] = [
    oldTestament,
    newTestament,
    bookOfMormon,
    doctrineAndCovenants,
    pearlOfGreatPrice,
  ];
  public score: Score[] = [];
  public isDailyChallenge: boolean = true;
  public difficulty: number = 10;

  private randomScriptureSubject = new BehaviorSubject<Verse>(
    this.workFlat.verses[0]
  );
  public randomScripture$ = this.randomScriptureSubject.asObservable();
  private randomChapterSubject = new BehaviorSubject<string[]>(['']);
  public randomChapter$ = this.randomChapterSubject.asObservable();
  private workSubject = new BehaviorSubject<Work>(this.work);
  public work$ = this.workSubject.asObservable();
  private showChapterSubject = new BehaviorSubject<boolean>(false);
  public showChapter$ = this.showChapterSubject.asObservable();
  private scoreSubject = new BehaviorSubject<Score[]>(this.score);
  public score$ = this.scoreSubject.asObservable();
  private totalScoreSubject = new BehaviorSubject<number>(this.totalScore);
  public totalScore$ = this.totalScoreSubject.asObservable();
  private isNerdSubject = new BehaviorSubject<boolean>(true);
  public isNerd$ = this.isNerdSubject.asObservable();

  public nextRound() {
    let randomNumber = 0;
    if (this.isDailyChallenge) {
      if (this.round == 1) {
        this.dailyChallenge = this.getDailyChallenge();
      } else if (!this.dailyChallenge) {
        this.dailyChallenge = this.getDailyChallenge();
      }
      switch (this.round) {
        case 1:
          randomNumber = this.dailyChallenge.randomNumber1;
          break;
        case 2:
          randomNumber = this.dailyChallenge.randomNumber2;
          break;
        case 3:
          randomNumber = this.dailyChallenge.randomNumber3;
          break;
        case 4:
          randomNumber = this.dailyChallenge.randomNumber4;
          break;
        case 5:
          randomNumber = this.dailyChallenge.randomNumber5;
          break;
      }
    }
    this.getRandomScripture(randomNumber);
  }
  public getRandomScripture(randomNumber: number) {
    this.max = this.workFlat.verses.length;
    const scritpureIndex =
      Math.floor(randomNumber * (this.max - this.min + 1)) + this.min;
    this.randomScripture = this.workFlat.verses[scritpureIndex];
    this.randomScriptureSubject.next(this.randomScripture);
    const verseArray = this.getRandomVerseChapterText();
    this.randomChapterSubject.next(verseArray);
    this.isNerdSubject.next(true);
  }

  public setWork(work: Work) {
    this.work = work;
    this.workFlat = this.getWorkFlat(work);
    this.workSubject.next(this.work);
    this.reset();
  }

  public getWorkFlat(work: Work): WorkFlat {
    switch (work) {
      case bookOfMormon:
        return bookOfMormonFlat;
      case doctrineAndCovenants:
        return doctrineAndCovenantsFLat;
      case newTestament:
        return newTestamentFlat;
      case oldTestament:
        return oldTestamentFlat;
      case pearlOfGreatPrice:
        return pearlOfGreatPriceFlat;
      default:
        return bookOfMormonFlat;
    }
  }

  public getDistanceFromRandomScripture(verse: Verse) {
    let randomScriptureIndex = this.workFlat.verses.indexOf(
      this.randomScripture
    );
    let guessIndex = this.getIndexOfVerse(this.workFlat.verses, verse);
    let distance = Math.abs(randomScriptureIndex - guessIndex);

    return distance;
  }

  public getIndexOfVerse(verses: Verse[], verse: Verse) {
    for (var i = 0; i < verses.length; i++) {
      if (
        verses[i].reference == verse.reference &&
        verses[i].text == verse.text
      ) {
        return i;
      }
    }
    return -1;
  }

  public getIndexOfChapter(chapters: Chapter[], chapter: Chapter) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].chapter == chapter.chapter) {
        return i;
      }
    }
    return -1;
  }

  public parseReference(reference: string) {
    let referenceArray = reference.split(' ');
    let bookArray = [...referenceArray];
    bookArray.pop();
    let book = bookArray.join(' ');
    let chapter = referenceArray[referenceArray.length - 1].split(':')[0];
    let verse = reference.split(':')[1];
    return { book: book, chapter: +chapter, verse: verse };
  }

  public getChapter(reference: string) {
    let referenceObject = this.parseReference(reference);
    let book = this.work.books.find(
      (book) => book.book == referenceObject.book
    );
    let chapter = book.chapters.find(
      (chapter) => chapter.chapter == referenceObject.chapter
    );
    return chapter;
  }

  public getChapterTextArray(reference: string): string[] {
    let chapter = this.getChapter(reference);
    let newTextArray = [];
    for (let verse of chapter.verses) {
      newTextArray.push(' ' + verse.text);
    }
    return newTextArray;
  }

  public getRandomVerseChapterText(): string[] {
    return this.getChapterTextArray(this.randomScripture.reference);
  }

  public calculateScore(distance: number): number {
    const sizeOfWork = this.workFlat.verses.length;
    const scoringDistance = sizeOfWork / this.difficulty;
    const scorePercentage = (scoringDistance - distance) / scoringDistance;
    const scoreScalar = 100;
    let score = Math.ceil(scorePercentage * scoreScalar);
    if (score < 0) {
      return 0;
    }
    if (this.isNerdSubject.value) {
      score = score * 2;
    }
    return score;
  }

  public closeChapter() {
    this.showChapterSubject.next(false);
  }

  public updateScore(score: number) {
    this.totalScore += score;
    this.score.push({
      round: this.round,
      score: score,
      isNerd: this.isNerdSubject.value,
    });
    this.round++;
    this.scoreSubject.next(this.score);
    this.totalScoreSubject.next(this.totalScore);
  }

  public reset() {
    this.totalScore = 0;
    this.round = 1;
    this.score = [];
  }

  public getDailyChallenge(): Challenge5 {
    const challenge = this.generateDailyChallenge();
    return challenge;
  }

  public generateDailyChallenge(): Challenge5 {
    this.prngService.setSeed(this.work.title);
    const randomNumber1 = this.prngService.random();
    const randomNumber2 = this.prngService.random();
    const randomNumber3 = this.prngService.random();
    const randomNumber4 = this.prngService.random();
    const randomNumber5 = this.prngService.random();

    this.prngService.reset();

    let dailyChallenge: Challenge5 = {
      round1: 1,
      randomNumber1: randomNumber1,
      round2: 2,
      randomNumber2: randomNumber2,
      round3: 3,
      randomNumber3: randomNumber3,
      round4: 4,
      randomNumber4: randomNumber4,
      round5: 5,
      randomNumber5: randomNumber5,
    };
    return dailyChallenge;
  }

  public hasLookedAtChapter() {
    this.isNerdSubject.next(false);
  }
}
