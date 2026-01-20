import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // بسيط للـ prototype: قارن بيانات الاعتماد مع متغيرات البيئة
        const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

        if (!credentials) return null;
        const email = (credentials.email || "").toLowerCase();
        const password = credentials.password || "";

        const isAdmin = ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD;
        // للـ prototype: أي مستخدم يدخل بيانات صحيحة للـ admin يُعطى دور admin
        if (isAdmin) {
          return { id: email, email, name: email, isAdmin: true };
        }
        // يمكن توسيع للتعامل مع مستخدمين عاديين لاحقاً
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).isAdmin = token.isAdmin || false;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/api/auth/signin' // NextAuth default UI أو نركب صفحة مخصصة لاحقاً
  }
});