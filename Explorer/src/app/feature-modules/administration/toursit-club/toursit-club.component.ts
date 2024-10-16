import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
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

  constructor(private touristService: AdministrationService) { }

  ngOnInit(): void {
    this.loadTourists();
  }

  loadTourists(): void {
    // Step 1: Get filtered tourists
    this.touristService.getFilteredTourists(this.page, this.pageSize).subscribe(touristData => {
      const tourists: AccountDTO[] = touristData.results; 
      console.log('Tourist Data:', touristData);

      this.touristService.getClubInvites(this.page, this.pageSize).subscribe(inviteData => {
        const clubInvites = inviteData.results;
        console.log('Club Invites Data:', inviteData);
        const acceptedMemberIds = new Set<number>(
          clubInvites
            .filter(invite => invite.status === 1)
            .map(invite => invite.touristId)
        );

        this.members = tourists.filter(tourist => {
          return acceptedMemberIds.has(tourist.id);
        });

        this.nonMembers = tourists.filter(tourist => {
          return !acceptedMemberIds.has(tourist.id);
        });

        console.log('Members:', this.members);
        console.log('Non-members:', this.nonMembers);
      });
    });
  }

  removeMember(dto: ClubInviteDTO): void {
    this.touristService.removeTouristFromClub(dto).subscribe(() => {
      this.loadTourists(); 
    });
  }

  inviteTourist(dto: ClubInviteDTO): void {
    this.touristService.inviteTouristToClub(dto).subscribe(() => {
      this.loadTourists();
    });
  }
}
