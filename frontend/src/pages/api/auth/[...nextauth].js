// NextAuth configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const options = {
  providers: [
    GoogleProvider({
      clientId: '396686002693-k7g8t52ua3em5f32pns8932gs5h4fcm4.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log('Sign-in successful:', user.email);
      return false; // Indicates successful sign-in
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
  },
  pages: {
    signIn: '/login', // If you have a custom sign-in page, specify its URL here
    // After sign-in redirect, specify the URL you want to redirect to
    // Change '/dashboard' to the appropriate URL
    signInCallback: '/dashboard',
  }
};

export default NextAuth(options);
