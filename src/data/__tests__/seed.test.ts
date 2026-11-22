import { describe, expect, it } from 'vitest';
import { initialListings, initialReports, initialReviews } from '../seed';

describe('listing seed coverage', () => {
  it('includes at least five reviews for every listing', () => {
    for (const listing of initialListings) {
      const listingReviews = initialReviews.filter(
        (review) => review.targetType === 'house' && review.targetId === listing.id
      );

      expect(listingReviews.length, listing.id).toBeGreaterThanOrEqual(5);
    }
  });

  it('includes at least five reports for every listing', () => {
    for (const listing of initialListings) {
      const listingReports = initialReports.filter(
        (report) => report.targetType === 'listing' && report.targetId === listing.id
      );

      expect(listingReports.length, listing.id).toBeGreaterThanOrEqual(5);
    }
  });
});
