import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '../entities/subscription';

export interface SubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription | null>;
  findAll(): Promise<Subscription[]>;
  create(data: CreateSubscriptionInput): Promise<Subscription>;
  update(id: string, data: UpdateSubscriptionInput): Promise<Subscription>;
  delete(id: string): Promise<boolean>;
}
