"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const LoadingScreen = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  console.log(isSignedIn);

  useEffect(() => {
    function redirectToDashboard() {
      if (isLoaded && user) {
        router.push(`/miembro/${user.id}`);
      }
    }
    redirectToDashboard();
  }, [isLoaded, user]);
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-5 text-lg text-gray-600">
        Redirigiendo a tu página, favor de esperar...
      </p>
    </div>
  );
};

export default LoadingScreen;
