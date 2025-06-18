import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; 
import { schema } from "@/lib/db/schema"; // Import schema from the same location as db, adjust path if needed
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: schema
    }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: { 
        google: { 
           clientId: process.env.GOOGLE_CLIENT_ID as string, 
           clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }, 
});