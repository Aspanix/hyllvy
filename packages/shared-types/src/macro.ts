export interface MacroProfile {
  userId: string;
  dailyProteinG: number;
  dailyCarbsG: number;
  dailyFatG: number;
  dailyCalories: number;
}

export interface ShoppingSession {
  id: string;
  userId: string;
  storeId: string;
  startedAt: Date;
  endedAt: Date | null;
}

export interface SessionItem {
  sessionId: string;
  productId: string;
  quantity: number;
  addedAt: Date;
}
