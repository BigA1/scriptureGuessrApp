import { Component, OnDestroy, OnInit } from "@angular/core";
import { ScripturesAppService } from "../scripturesApp.service";
import { Work } from "../scripture.model";

@Component({
    selector: 'tall-work-selector',
    templateUrl: './workSelector.component.html',
    styleUrls: ['./workSelector.component.css']
})
export class WorkSelectorComponent implements OnInit, OnDestroy {
    public works: Work[];

    constructor(
        private scriptureAppService: ScripturesAppService
    ) {}

    ngOnInit(): void {
        this.works = this.scriptureAppService.allWorks;
    }

    onWorkSelected(work: Work) {
        this.scriptureAppService.setWork(work);
    }

    ngOnDestroy(): void {
    
    }

}