import { useRouter } from "next/navigation";
import { toast } from "sonner";

// sign out
export const useAuth = () => {
  const router = useRouter();
  const signOut = async () => {
    try {
      // Don't have to create this endpoint
      const res = await fetch(
        // NEXT_PUBLIC
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Signed out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error("Couldn't sign out, please try again.");
    }
  };

  return { signOut };
};
