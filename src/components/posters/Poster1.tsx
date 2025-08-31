import React from "react";

const winners = [
  { position: 1, name: "Ijlal ek", place: "Kunnummal" },
  { position: 2, name: "Riswinjas", place: "Kolappuram North" },
  { position: 3, name: "Abdul Hadi k", place: "Mathad" },
];

const Poster = () => (
  <div className="bg-white font-sans w-full max-w-2xl mx-auto p-0 m-0 relative overflow-hidden shadow-sm">
    {/* Top Header */}
    <div className="flex items-center justify-between p-4">
      <span className="text-gray-700 font-semibold">@sjmkolappuram</span>
      <div className="text-right">
        <span className="text-4xl font-black text-blue-900 block leading-none">47</span>
        <span className="text-base font-semibold text-gray-700 leading-none">Qawali</span>
        <span className="text-xs text-gray-500">General</span>
      </div>
    </div>

    {/* Middle Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-6 py-6">
      {/* Winners List */}
      <div className="flex-1">
        <ol className="space-y-4">
          {winners.map((w, idx) => (
            <li key={idx} className="flex flex-col">
              <span className="text-lg font-bold text-blue-900">{`${w.position}. ${w.name}`}</span>
              <span className="text-sm text-gray-500">{w.place}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Illustration (replace with real image) */}
      <div className="flex-1 flex justify-center">
        <img
          src="your-house-image.png"
          alt="House Illustration"
          className="h-52 object-contain"
        />
      </div>
    </div>

    {/* Bottom Section */}
    <div className="flex flex-col items-center justify-center py-4 border-t bg-white">
      <div className="text-sm font-bold">SJM കൊളപ്പുറം റെഞ്ച്</div>
      <div className="text-red-800 font-extrabold text-2xl mt-1">മദ്ഹ്സാ കലോത്സവ്</div>
      <div className="text-xs text-gray-600 mt-2">
        2023 ഡിസംബർ 10 ഞായർ <br /> മദ്ഹ്സാ മഞ്ചേരി, അന്വാരുള്ള
      </div>
    </div>
  </div>
);

export default Poster;
