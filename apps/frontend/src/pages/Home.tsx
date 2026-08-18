import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Home() {
  const { data: currUserData } = useCurrentUser();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      <h1 className="p-10 text-2xl font-semibold text-black">Hello World</h1>
      <div className="flex flex-col items-center gap-4">
        {!currUserData && <GoogleOAuthButton />}
      </div>
    </div>
  );
}
