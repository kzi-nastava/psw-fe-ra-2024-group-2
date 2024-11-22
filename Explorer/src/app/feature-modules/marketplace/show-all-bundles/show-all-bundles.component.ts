import { Component, OnInit } from "@angular/core";
import { Bundle } from "../model/bundle.model";
import { PaymentBundleService } from "../services/payment-bundle.service";
import { PagedResult } from "../../blog/blog.module";

@Component({
    selector: 'xp-show-all-bundles',
    templateUrl: './show-all-bundles.component.html',
    styleUrls: ['./show-all-bundles.component.css']
})
export class ShowAllBundlesComponent implements OnInit {
    bundles: Bundle[] = [];
    constructor(private bundleService: PaymentBundleService) { }

    ngOnInit(): void {
        this.loadBundles();
    }

    loadBundles(): void {
        this.bundleService.getBundles().subscribe({
            next: (result: PagedResult<Bundle>) => {
                this.bundles = result.results;
                console.log('Bundles loaded', this.bundles);
            },
            error: (err) => {
                console.error('Error loading bundles', err);
            }
        });
    }
}