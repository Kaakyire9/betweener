"use client";
import { Dialog } from "@headlessui/react";
import { Fragment } from "react";
import ProfileForm from "./ProfileForm";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  initialValues: Record<string, any>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<any>) => void;
  onRemove?: () => void;
};

export default function EditProfileModal({ open, onClose, initialValues, onSubmit, loading, errors, onChange, onRemove }: EditProfileModalProps) {
  return (
    <Dialog open={open} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <Dialog.Panel className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-auto animate-fade-in max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold text-blue-700 mb-4 text-center">Edit Profile</Dialog.Title>
          <ProfileForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            loading={loading}
            errors={errors}
            onChange={onChange}
            onRemove={onRemove}
            isEdit={true}
          />
          <button onClick={onClose} className="mt-4 w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
