// import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: '396686002693-k7g8t52ua3em5f32pns8932gs5h4fcm4.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    
    async signIn(user, account, profile) {
      console.log('Sign-in successful:', user.email);          
      signIn('google');       
      return false; 
    },

    async session(session, token) {
      // Log session creation
      console.log('Session created for:', session.user.email);
      return session;
    },

    async error(error, ctx) {
      // Log authentication errors
      console.error('Authentication error:', error.message);
      return Promise.reject(error);
    }
  }
});