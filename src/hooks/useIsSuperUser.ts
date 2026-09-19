import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/profile";
import { useAuthStore } from "../stores/useAuthStore";

export const useIsSuperUser = () => {
  const user = useAuthStore((state) => state.user);
  const authInitialized = useAuthStore((state) => state.initialized);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: Boolean(user),
  });

  const isLoading = !authInitialized || (Boolean(user) && profileLoading);
  const isSuperUser = profile?.isSuperUser ?? false;

  return { isSuperUser, isLoading };
};
