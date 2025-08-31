import React from "react";

const winners = [
  { position: 1, name: "ADIL PP", place: "PARAMBIL PEEDIKA" },
  { position: 2, name: "SAYYID BISHR", place: "CHELARI" },
  { position: 3, name: "AMEEN", place: "THENHIPPALAM" },
];

function ordinal(num) {
  if (num === 1) return "01st";
  if (num === 2) return "02nd";
  if (num === 3) return "03rd";
  return `${num}`;
}

const numberColors = [
  "text-green-600",
  "text-orange-500",
  "text-yellow-600"
];

const Poster = () => (
  <div className="bg-white p-0 m-0 font-sans w-full max-w-2xl mx-auto relative overflow-hidden">
    {/* Social and Top header */}
    <div className="flex items-start justify-between p-4 pt-6">
      <div>
        <div className="flex gap-2 items-center mb-1">
          {/* Social icons can be used with react-icons or img tags */}
          <span className="text-black text-lg font-bold">@ssfthenhippalamdivision</span>
        </div>
      </div>
      <div className="rounded-full border border-gray-200 text-gray-600 font-bold flex items-center px-4 py-2 text-xl shadow-sm">
        13
      </div>
    </div>

    {/* Title and center part */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-6 pb-10">
      {/* Left Side: Winners */}
      <div className="bg-gray-50 rounded-3xl p-8 pt-5 min-w-[260px] flex-1 shadow-sm">
        <div className="text-xs font-bold uppercase text-gray-600 mb-1 tracking-wide">General</div>
        <div className="text-lg font-black mb-4 tracking-tight">RISALA QUIZ</div>
        <div className="flex flex-col gap-4">
          {winners.map((w, idx) => (
            <div key={w.position} className="flex items-center gap-2">
              <span className={`font-bold text-xl ${numberColors[idx]} mr-2`}>{ordinal(w.position)}</span>
              <div>
                <span className="font-extrabold text-lg uppercase tracking-tight">{w.name}</span>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{w.place}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right Side: Art title & tree */}
      <div className="flex flex-col items-center flex-1">
        {/* Poster title as image */}
        <img src="your-title-logo.png" alt="Poster Title" className="h-16 mb-4" />
        {/* Tree illustration */}
        <img src="your-tree-image.png" alt="Tree" className="h-44" />
      </div>
    </div>

    {/* Bottom bar with logo row */}
    <div className="flex flex-col items-center w-full bg-gray-50 border-t pt-2 pb-3">
      <div className="text-lg font-black text-gray-700 leading-tight tracking-tight">SSF THENHIPPALAM DIVISION</div>
      <div className="text-xs text-gray-600 font-semibold mt-0.5 mb-2">
        students centre chelari, ssfthenhippalamdivision@gmail.com
      </div>
      <div className="flex gap-3 items-center justify-center mt-2">
        {/* Org logo */}
        <img src="your-org-logo.png" alt="SSF Logo" className="h-10" />
        {/* Poster bottom art/image */}
        <img src="your-bottom-banner.png" alt="Bottom Art" className="h-10" />
        <div className="flex flex-col text-center text-xs px-2 font-semibold">
          <div>2023 ജനുവരി 01 02</div>
          <div>കൈ.എം.നഗർ</div>
        </div>
        {/* Another logo */}
        <img src="your-another-logo.png" alt="30 Logo" className="h-8" />
      </div>
    </div>
  </div>
);

export default Poster;
