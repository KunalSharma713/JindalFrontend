import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-jindal-gray-100 text-center px-4">
      {/* Logo */}
      <img
        src="/jindal-steel-logo-light.svg"
        alt="Jindal Steel Logo"
        className="w-40 h-auto mb-8"
      />

      {/* 404 Title */}
      <h1 className="text-6xl md:text-8xl font-bold text-gray-700">404</h1>

      {/* Message */}
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
        Oops! Page Not Found
      </h2>
      {/* <p className="mt-2 text-gray-600 max-w-md">
        The page you are looking for doesn’t exist or may have been moved.
      </p> */}
      <p className="mt-2 text-gray-600 max-w-md">
        Oops! The page you’re looking for can’t be found. It might have been
        removed, renamed, or is temporarily unavailable.
      </p>

      {/* Button */}
      <Button type="submit" className=" mt-8" onClick={() => navigate("/")}>
        ⬅ Back to Home
      </Button>
    </div>
  );
}
