import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-200">
      {/* Logo */}
      <img
        src="/jindal-steel-logo-light.svg"
        alt="Jindal Steel Logo"
        className="w-40 h-auto mb-8"
      />

      {/* Loading slider */}
      <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
