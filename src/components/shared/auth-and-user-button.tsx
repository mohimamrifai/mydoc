import AuthButton from "./auth-button";
import AvatarUserButton from "./avatar-user-button";
import { auth } from "@/auth";

export default async function AuthAndUserButton() {
    const session = await auth();
    return (
        <div>
            {session ? (
                <AvatarUserButton

                    user={session?.user}
                />
            ) : (
                <AuthButton />
            )}
        </div>
    );
}
