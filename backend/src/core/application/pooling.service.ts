import { PoolMember } from '../domain/pooling';
import { IPoolingRepository } from '../ports/pooling.repository';
import { ComplianceService } from './compliance.service';

interface PoolMemberInput {
  shipId: string;
  year: number;
}

export class PoolingService {
  constructor(
    private readonly poolingRepo: IPoolingRepository,
    private readonly complianceService: ComplianceService
  ) {}

  public async createPool(year: number, members: PoolMemberInput[]): Promise<PoolMember[]> {
    // 1. Get initial state for all members
    const membersBefore = await Promise.all(
      members.map(async (m) => {
        const adjustedCB = await this.complianceService.getAdjustedComplianceBalance(m.shipId, m.year);
        return {
          ship_id: m.shipId,
          cb_before: adjustedCB.cb_gco2eq,
          cb_after: adjustedCB.cb_gco2eq, // Initialize cb_after
        };
      })
    );

    // 2. Validate Rule 1: Sum(adjustedCB) >= 0
    const poolSum = membersBefore.reduce((sum, m) => sum + m.cb_before, 0);
    if (poolSum < 0) {
      throw new Error(`Pool is invalid. Pool sum is ${poolSum.toFixed(2)}, but must be >= 0.`);
    }

    // 3. Allocate
    const { finalMembers } = this.allocatePoolFunds(membersBefore);

    // 4. Validate Rules 2 & 3
    for (const member of finalMembers) {
      if (member.cb_before < 0 && member.cb_after < member.cb_before) {
        throw new Error(`Validation Failed: Deficit ship ${member.ship_id} exited worse.`);
      }
      if (member.cb_before > 0 && member.cb_after < 0) {
        throw new Error(`Validation Failed: Surplus ship ${member.ship_id} exited negative.`);
      }
    }

    // 5. Save to DB
    return this.poolingRepo.createPool(year, finalMembers);
  }

  private allocatePoolFunds(members: PoolMember[]) {
    const deficitShips = members.filter(m => m.cb_after < 0).sort((a, b) => a.cb_after - b.cb_after);
    const surplusShips = members.filter(m => m.cb_after > 0).sort((a, b) => b.cb_after - a.cb_after);

    let totalDeficit = Math.abs(deficitShips.reduce((sum, s) => sum + s.cb_after, 0));

    // Greedy allocation
    for (const surplusShip of surplusShips) {
      if (totalDeficit === 0) break; // All deficits covered

      let availableSurplus = surplusShip.cb_after;
      
      for (const deficitShip of deficitShips) {
        if (deficitShip.cb_after === 0) continue; // This deficit is covered
        if (availableSurplus === 0) break; // This surplus ship is empty

        const deficitAmount = Math.abs(deficitShip.cb_after);
        
        // Transfer the minimum of what's needed or what's available
        const transferAmount = Math.min(availableSurplus, deficitAmount);

        deficitShip.cb_after += transferAmount;
        surplusShip.cb_after -= transferAmount;
        
        availableSurplus -= transferAmount;
        totalDeficit -= transferAmount;
      }
    }
    
    // Combine all members back into one array
    const finalMembers = [...surplusShips, ...deficitShips, ...members.filter(m => m.cb_before === 0)];
    return { finalMembers };
  }
}