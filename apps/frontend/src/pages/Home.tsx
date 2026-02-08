import useGoogleAuth from "../hooks/useGoogleAuth";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Home() {
	const { googleSignInMutation } = useGoogleAuth();
	const { data: currUserData } = useCurrentUser();

	return (
		<div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">
				<div className="flex flex-col items-center gap-4">
					{!currUserData && (
						<button
							className="group relative flex items-center gap-3 bg-white text-slate-900 px-8 py-3.5 rounded-lg font-medium hover:bg-slate-100 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:cursor-pointer"
							onClick={() => googleSignInMutation()}
						>			
							Continue with Google
						</button>
					)}
				</div>
		</div>
	);
}