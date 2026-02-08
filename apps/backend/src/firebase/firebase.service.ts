import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  constructor(@Inject('FIREBASE_ADMIN') private firebase: admin.app.App) {}

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebase.auth().verifyIdToken(token);
    } catch (e) {
      throw new Error('Invalid Google ID token');
    }
  }
}