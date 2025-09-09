"use client";
import { useState } from "react";

type ProfileFormProps = {
  initialValues: Record<string, any>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<any>) => void;
  onRemove?: () => void;
  isEdit?: boolean;
};

export default function ProfileForm({ initialValues, onSubmit, loading, errors, onChange, onRemove, isEdit }: ProfileFormProps) {
  // All form fields and handlers are controlled by parent
  return (
    <form className="w-full flex flex-col gap-4 animate-fade-in" onSubmit={onSubmit} noValidate aria-label="Profile form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="font-medium text-blue-700 flex items-center gap-1">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={initialValues.fullName}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.fullName ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            required
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.fullName}</div>}
        </div>
        <div>
          <label htmlFor="age" className="font-medium text-blue-700 flex items-center gap-1">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="Age"
            value={initialValues.age}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.age ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            min={18}
            required
            aria-invalid={!!errors.age}
          />
          {errors.age && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.age}</div>}
        </div>
        <div>
          <label htmlFor="gender" className="font-medium text-blue-700 flex items-center gap-1">Gender</label>
          <select
            id="gender"
            name="gender"
            value={initialValues.gender}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.gender ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            required
            aria-invalid={!!errors.gender}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.gender}</div>}
        </div>
        <div>
          <label htmlFor="region" className="font-medium text-blue-700 flex items-center gap-1">Region</label>
          <input
            id="region"
            name="region"
            type="text"
            placeholder="Region"
            value={initialValues.region}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.region ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            required
            aria-invalid={!!errors.region}
          />
          {errors.region && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.region}</div>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="bio" className="font-medium text-blue-700 flex items-center gap-1">Short Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Short Bio"
            value={initialValues.bio}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.bio ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            rows={3}
            required
            aria-invalid={!!errors.bio}
          />
          {errors.bio && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.bio}</div>}
        </div>
        <div>
          <label htmlFor="tribe" className="font-medium text-blue-700 flex items-center gap-1">Tribe</label>
          <input
            id="tribe"
            name="tribe"
            type="text"
            placeholder="Tribe"
            value={initialValues.tribe}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.tribe ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            required
            aria-invalid={!!errors.tribe}
          />
          {errors.tribe && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.tribe}</div>}
        </div>
        <div>
          <label htmlFor="religion" className="font-medium text-blue-700 flex items-center gap-1">Religion</label>
          <input
            id="religion"
            name="religion"
            type="text"
            placeholder="Religion"
            value={initialValues.religion}
            onChange={onChange}
            className={`border-2 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 transition ${errors.religion ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
            required
            aria-invalid={!!errors.religion}
          />
          {errors.religion && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.religion}</div>}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center mt-2">
        <div className="flex flex-col w-full">
          <label htmlFor="minAgeInterest" className="font-medium text-blue-700 flex items-center gap-1">Preferred Age Range</label>
          <div className="flex gap-2 items-center">
            <input
              id="minAgeInterest"
              name="minAgeInterest"
              type="number"
              min={18}
              max={99}
              value={initialValues.minAgeInterest}
              onChange={onChange}
              className={`border-2 px-4 py-2 rounded-lg w-24 focus:ring-2 focus:ring-blue-400 transition ${errors.minAgeInterest ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
              required
              aria-invalid={!!errors.minAgeInterest}
            />
            <span>to</span>
            <input
              id="maxAgeInterest"
              name="maxAgeInterest"
              type="number"
              min={18}
              max={99}
              value={initialValues.maxAgeInterest}
              onChange={onChange}
              className={`border-2 px-4 py-2 rounded-lg w-24 focus:ring-2 focus:ring-blue-400 transition ${errors.maxAgeInterest ? 'border-red-500 animate-shake' : 'border-blue-200'}`}
              required
              aria-invalid={!!errors.maxAgeInterest}
            />
          </div>
          {errors.minAgeInterest && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.minAgeInterest}</div>}
          {errors.maxAgeInterest && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.maxAgeInterest}</div>}
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <label className="font-medium text-blue-700 flex items-center gap-1">Profile Picture</label>
        <div className="flex items-center gap-4">
          {initialValues.avatarUrl ? (
            <img src={initialValues.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-blue-300" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-2xl font-bold border-2 border-blue-200">?</div>
          )}
          <input
            id="profilePic"
            name="profilePic"
            type="file"
            accept="image/*"
            onChange={onChange}
            className="block"
          />
          {initialValues.avatarUrl && (
            <button
              type="button"
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              onClick={e => {
                if (typeof window !== 'undefined' && window.confirm('Remove profile picture?')) {
                  if (typeof onRemove === 'function') onRemove();
                }
              }}
            >
              Remove
            </button>
          )}
        </div>
        {errors.avatarUrl && <div className="text-xs text-red-600 mt-1 animate-shake">{errors.avatarUrl}</div>}
      </div>
      <button
        type="submit"
        className="mt-4 bg-gradient-to-r from-blue-600 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-60 animate-pop-in"
        disabled={loading}
        aria-busy={loading}
      >
        {isEdit ? "Save Changes" : "Create Profile"}
      </button>
    </form>
  );
}
