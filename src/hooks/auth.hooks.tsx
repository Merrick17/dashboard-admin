"use client";
import { useToast } from "@/components/ui/use-toast";
import { post } from "@/lib/apiHelpers";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocalStorageState } from "ahooks";

const API_LOGIN_ENDPOINT = "auth/auth"; // Replace this with your actual login endpoint

type LoginData = {
  phoneNumber: string;
  password: string;
};

export const useAuth = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [authToken, setAuthToken] = useLocalStorageState<String | null>(
    "authToken",
    { defaultValue: null }
  );
  return useMutation({
    mutationFn: (loginInfo: LoginData) => post(API_LOGIN_ENDPOINT, loginInfo),
    onSuccess: (data) => {
      if (data.success) {
        router.replace("/dashboard");
        setAuthToken(data.token);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Numéro Tél ou mot de passe incorrect"
        });
      }
    }
  });
};
