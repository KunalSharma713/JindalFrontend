export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-jindal-gray-100 text-center px-4">
      {/* Logo */}
      <img
        src="/jindal-steel-logo-light.svg"
        alt="Jindal Steel Logo"
        className="w-40 h-auto mb-8"
      />

      {/* Coming Soon Title */}
      <h1 className="text-5xl md:text-7xl font-bold text-gray-700">
        🚧 Coming Soon
      </h1>

      {/* Message */}
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
        Something exciting is on the way!
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        We’re working hard to bring you this page.  
        Stay tuned for updates and check back soon.
      </p>
    </div>
  );
}
