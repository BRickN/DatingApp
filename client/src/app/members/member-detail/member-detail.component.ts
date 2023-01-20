import { AccountService } from './../../_services/account.service';
import { PresenceService } from './../../_services/presence.service';
import { MessageService } from './../../_services/message.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { Message } from 'src/app/_models/message';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user?: User;

  constructor(private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, public presenceService: PresenceService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    });

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.getImages();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    return imageUrls;
  }

  onTabActivated(data: TabDirective, tabId: number) {
    // UPDATE QUERY PARAMS
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId }
    });

    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.username)
    } else {
      this.messageService.stopHubConnection();
    }

  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    console.log(this.memberTabs.tabs)
    this.memberTabs.tabs[tabId].active = true;
  }
}
