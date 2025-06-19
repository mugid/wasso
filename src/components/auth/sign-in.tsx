import { authClient } from "@/lib/auth-client"

const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "google"
    })
}

export function SignIn() {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign In
        </button>
    )
}