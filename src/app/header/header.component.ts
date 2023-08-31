import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { HelpDialogComponent } from "../help/helpDialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'tall-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService,
    private dialog: MatDialog) {}


  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  help() {
    const dialogRef = this.dialog.open(HelpDialogComponent);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
