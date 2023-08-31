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
import * as dailyChallenges from '../challenges/daily-challenges.json';

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

@Injectable({ providedIn: 'root' })
export class ScripturesAppService {
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
  public dailyChallenge: ChallengeSet = dailyChallenges;
  public isDailyChallenge: boolean = true;
  public dailyChallengeIndex: number = 0;
  public dailyChallengeOffset: number = 0;
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
    let randomNumber = Math.random();
    if(this.isDailyChallenge) {
      let challenge: Challenge5 = this.getDailyChallenge();
      switch (this.round) { 
        case 1:
            randomNumber  = challenge.randomNumber1;
            break;
        case 2:
            randomNumber  = challenge.randomNumber2;
            break;
        case 3:
            randomNumber  = challenge.randomNumber3;
            break;
        case 4:
            randomNumber  = challenge.randomNumber4;
            break;
        case 5:
            randomNumber  = challenge.randomNumber5;
            break;
      }
    }
    this.getRandomScripture(randomNumber);
  }
  public getRandomScripture(randomNumber?: number) {
    this.max = this.workFlat.verses.length;
    if (!randomNumber) {
      randomNumber = Math.random();
    }
    let scritpureIndex =
      Math.floor(randomNumber * (this.max - this.min + 1)) + this.min;
    this.randomScripture = this.workFlat.verses[scritpureIndex];
    this.randomScriptureSubject.next(this.randomScripture);
    let verseArray = this.getRandomVerseChapterText();
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
        this.dailyChallengeOffset = 1;
        return doctrineAndCovenantsFLat;
      case newTestament:
        this.dailyChallengeOffset = 2;
        return newTestamentFlat;
      case oldTestament:
        this.dailyChallengeOffset = 3;
        return oldTestamentFlat;
      case pearlOfGreatPrice:
        this.dailyChallengeOffset = 4;
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
    const scoringDistance = sizeOfWork/this.difficulty;
    const scorePercentage = (scoringDistance - distance) / scoringDistance;
    const scoreScalar = 100;
    let score = Math.ceil(scorePercentage * scoreScalar);
    if (score < 0) {
      return 0;
    }
    if(this.isNerdSubject.value) {
        score = score * 2;
    }
    return score;
  }

  public closeChapter() {
    this.showChapterSubject.next(false);
  }

  public updateScore(score: number) {
    this.totalScore += score;
    this.score.push({ round: this.round, score: score, isNerd: this.isNerdSubject.value });
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
    let today = new Date();
    let startDate = new Date(2023,6,8);
    let diff = Math.abs(startDate.getTime() - today.getTime());
    let diffDays = Math.floor(diff / (1000 * 3600 * 24));
    this.dailyChallengeIndex = diffDays + this.dailyChallengeOffset;
    return this.dailyChallenge.challenges[this.dailyChallengeIndex]; 
  }

  public generateDailyChallenge(): Challenge5[] {
    let dailyChallenges: Challenge5[] = [];
    for (let i = 0; i < 365; i++) {
      let randomNumber1 = Math.random();
      let randomNumber2 = Math.random();
      let randomNumber3 = Math.random();
      let randomNumber4 = Math.random();
      let randomNumber5 = Math.random();

      let dailyChallenge: Challenge5 =
        {
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
        }
        dailyChallenges.push(dailyChallenge);
    }
    return dailyChallenges;
  }

  public hasLookedAtChapter() {
    this.isNerdSubject.next(false);
  }
}
