import GoogleOAuthButton from "../components/GoogleOAuthButton";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Home() {
	const { data: currUserData } = useCurrentUser();

	return (
		<div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">
				<div className="flex flex-col items-center gap-4">
					{!currUserData && (
						<GoogleOAuthButton />
					)}
				</div>
		</div>
	);
}