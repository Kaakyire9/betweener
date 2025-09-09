
import React, { useState } from "react";

const REGIONS = ["Greater Accra", "Ashanti", "Volta", "Central"];
const TRIBES = ["Akan", "Ewe", "Ga-Adangbe", "Mole-Dagbani"];
const RELIGIONS = ["Christian", "Muslim", "Traditionalist", "Other"];
const INTERESTS = ["Afrobeats", "Football", "Jollof", "Church", "Kumawood Movies"];

export default function DiscoveryFilters() {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [region, setRegion] = useState("");
  const [tribe, setTribe] = useState("");
  const [religion, setReligion] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const handleInterestChange = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Age Range */}
        <div>
          <label className="block text-xs font-semibold mb-1">Age Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={18}
              max={99}
              value={ageRange[0]}
              onChange={e => setAgeRange([Number(e.target.value), ageRange[1]])}
              className="w-14 border rounded px-1 py-0.5 text-sm"
            />
            <span>-</span>
            <input
              type="number"
              min={18}
              max={99}
              value={ageRange[1]}
              onChange={e => setAgeRange([ageRange[0], Number(e.target.value)])}
              className="w-14 border rounded px-1 py-0.5 text-sm"
            />
          </div>
        </div>
        {/* Region */}
        <div>
          <label className="block text-xs font-semibold mb-1">Region</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {/* Tribe */}
        <div>
          <label className="block text-xs font-semibold mb-1">Tribe</label>
          <select
            value={tribe}
            onChange={e => setTribe(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {TRIBES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {/* Religion */}
        <div>
          <label className="block text-xs font-semibold mb-1">Religion</label>
          <select
            value={religion}
            onChange={e => setReligion(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Any</option>
            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      {/* Interests */}
      <div>
        <label className="block text-xs font-semibold mb-1">Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <label key={interest} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="accent-pink-500"
              />
              {interest}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
