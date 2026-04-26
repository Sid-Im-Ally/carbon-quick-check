export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-emerald-500 rounded-full" />
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              Carbon Quick Check
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 ml-4 pl-0.5">
            Early-stage operational carbon estimates for master planning
          </p>
        </div>
      </div>
    </header>
  );
}
