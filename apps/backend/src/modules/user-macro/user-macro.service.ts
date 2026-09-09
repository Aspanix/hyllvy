import { Injectable } from '@nestjs/common';
import { MacroProfile, ShoppingSession, SessionItem } from '@hyllvy/shared-types';

/**
 * User macro profiles and the shopping session / running tally (build brief
 * Section 4, data model in Section 6). No business logic beyond CRUD +
 * tally bookkeeping lives here - cost-effectiveness scoring is a separate
 * module (see cost-effectiveness).
 *
 * TODO(deliverable - data layer): back with Postgres. Stubbed for now.
 */
@Injectable()
export class UserMacroService {
  async getMacroProfile(_userId: string): Promise<MacroProfile | null> {
    throw new Error('UserMacroService.getMacroProfile is not implemented yet');
  }

  async setMacroProfile(_profile: MacroProfile): Promise<MacroProfile> {
    throw new Error('UserMacroService.setMacroProfile is not implemented yet');
  }

  async startShoppingSession(_userId: string, _storeId: string): Promise<ShoppingSession> {
    throw new Error('UserMacroService.startShoppingSession is not implemented yet');
  }

  async addSessionItem(_sessionId: string, _productId: string, _quantity: number): Promise<SessionItem> {
    throw new Error('UserMacroService.addSessionItem is not implemented yet');
  }

  async getRunningTally(_sessionId: string): Promise<Pick<MacroProfile, 'dailyProteinG' | 'dailyCarbsG' | 'dailyFatG' | 'dailyCalories'>> {
    throw new Error('UserMacroService.getRunningTally is not implemented yet');
  }
}
