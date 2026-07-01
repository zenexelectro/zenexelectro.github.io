import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const runtime = 'edge';

// NextAuth Configuration for Admin Login / അഡ്മിൻ ലോഗിൻ ചെയ്യാനുള്ള സംവിധാനം
const handler = NextAuth({
  providers: [
    GithubProvider({
      // Uses GitHub for authentication / ഗിറ്റ്ഹബ്ബ് ഉപയോഗിച്ചാണ് ലോഗിൻ ചെയ്യുന്നത്
      // These keys should be added in your Cloudflare/Vercel Environment Variables
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow the specific admin email / അഡ്മിന് മാത്രമേ ലോഗിൻ ചെയ്യാൻ സാധിക്കൂ
      // You can change this to your actual email if different / നിങ്ങളുടെ യഥാർത്ഥ ഇമെയിൽ ഇവിടെ നൽകാം
      const adminEmail = "zenexelectro@gmail.com"; 
      if (user.email === adminEmail) {
        return true;
      } else {
        return false; // Blocks anyone else from logging in / മറ്റുള്ളവർ ലോഗിൻ ചെയ്യുന്നത് തടയുന്നു
      }
    },
  },
});

export { handler as GET, handler as POST };
