import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { UseGoogleAuthHook } from "../interfaces";

export default function useGoogleAuth(): UseGoogleAuthHook {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const googleSignInMutation = async (credential: string) => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/google/sign-in`,
      {},
      {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
        withCredentials: true,
      },
    );

    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    navigate("/profile");
  };

  const signOut = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-out`,
      {},
      {
        withCredentials: true,
      },
    );

    queryClient.setQueryData(["currentUser"], null);
    queryClient.removeQueries({ queryKey: ["total-notifications"] });
    queryClient.removeQueries({ queryKey: ["your-chats"] });
  };

  return { googleSignInMutation, signOut };
}