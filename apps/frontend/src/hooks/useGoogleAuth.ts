import { signInWithPopup } from "@firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { UseGoogleAuthHook } from "../interfaces";
import { auth, googleProvider } from "../config/firebase";


export default function useGoogleAuth(): UseGoogleAuthHook {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const token = await result.user.getIdToken();
			return token;
		} catch (error) {
			console.log(error);
		}
	};

	const googleSignInMutation = async () => {
		const token = await handleGoogleSignIn();
		await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/api/auth/google/sign-in`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`
				},
				withCredentials: true
			}
		);

		await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

		navigate("/profile");
	};

	const signOut = async () => {
		await axios.post(
			`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-out`,
			{},
			{
				withCredentials: true
			}
		);

		queryClient.setQueryData(["currentUser"], null);
	};

	return { googleSignInMutation, signOut };
}
