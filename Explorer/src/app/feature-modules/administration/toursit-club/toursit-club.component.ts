import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { ClubInviteDTO } from '../model/clubinvitedto.model';
import { AccountDTO } from '../model/accountdto.model'; // Import AccountDTO

@Component({
  selector: 'xp-toursit-club',
  templateUrl: './toursit-club.component.html',
  styleUrls: ['./toursit-club.component.css']
})
export class ToursitClubComponent implements OnInit {
  members: any[] = [];     // Club members list
  nonMembers: any[] = [];  // Non-members list
  page = 1;
  pageSize = 10;
  currentUser: {};
  currentUserId:number=0;
  clubId:1;

  constructor(private touristService: AdministrationService,private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.authService.getCurrentUser().id;
    console.log('Current User:', this.currentUser);
    this.loadTourists();
  }

  loadTourists(): void {
    // Ensure currentUserId is set correctly
    if (!this.currentUserId) {
      console.log("Error: currentUserId is not set");
      return; // Exit if currentUserId is not defined
    }
  
    this.touristService.getFilteredTourists(this.page, this.pageSize).subscribe(touristData => {
      const tourists: AccountDTO[] = touristData.results; // Array of tourists
      console.log('Tourist Data:', touristData);
  
      this.touristService.getClubInvites(this.page, this.pageSize).subscribe(inviteData => {
        const clubInvites = inviteData.results; // Array of club invites
        console.log('Club Invites Data:', inviteData);
  
        // Extract all touristIds from inviteData
        const invitedTouristIds = clubInvites.map(invite => invite.touristId);
        console.log('List of all invited touristIds:', invitedTouristIds);
  
        // Create a set for faster lookup
        const invitedTouristIdSet = new Set<number>(invitedTouristIds);
        console.log("Invited IDs Set:", invitedTouristIdSet);
        console.log("Current User ID:", this.currentUserId);
  
        // Filter out non-members: tourists who are not invited and not the current user
        this.nonMembers = tourists.filter(tourist => {
          const isNotInvited = !invitedTouristIdSet.has(tourist.userId);
          const isNotCurrentUser = tourist.userId !== this.currentUserId; // Check if the tourist is not the current user
          console.log(`Tourist userId: ${tourist.userId}, Invited: ${!isNotInvited}, Current User: ${!isNotCurrentUser}`);
          return isNotInvited && isNotCurrentUser; // Only include non-invited and not current user
        });
  
        console.log('Non-members:', this.nonMembers);
      });
    });
  }

  removeMember(dto: ClubInviteDTO): void {
    this.touristService.removeTouristFromClub(dto).subscribe(() => {
      this.loadTourists(); 
    });
  }

  inviteTourist(dto: AccountDTO): void {
    var a:ClubInviteDTO= {userId:this.currentUserId,ownerId:this.currentUserId,touristId:dto.userId,clubId:0,date:new Date(),status:0};
    this.touristService.inviteTouristToClub(a).subscribe(() => {
      this.loadTourists();
    });
  }
}
