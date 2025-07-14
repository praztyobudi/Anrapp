"use client";

import { useEffect, useState } from "react";
import { Krisar, propsFormKrisar } from "./types";
import toast, { Toaster } from "react-hot-toast";
import { Send, X } from "lucide-react";

export default function FormKrisar({
  onSubmit,
  defaultValue,
  mode = "create",
  onCancel,
  userId,
}: propsFormKrisar) {
  const [kritik, setKritik] = useState("");
  const [saran, setSaran] = useState("");
  // const [id, setId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && defaultValue) {
      setKritik(defaultValue.critique);
      setSaran(defaultValue.suggestion);
    } else if (mode === "create") {
      // Kosongkan form saat bukan mode edit
      setKritik("");
      setSaran("");
    }
  }, [mode, defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kritik || !saran) {
      toast.error("All fields must be filled out!");
      setIsSubmitting(false);
      return;
    }
    if (
      kritik === defaultValue?.critique &&
      saran === defaultValue?.suggestion
    ) {
      onCancel?.();
      toast.error("No changes!");
      // setIsSubmitting(false);
      return;
    }
    const formData = {
      id: mode === "edit" && defaultValue ? defaultValue.id : null,
      user_id: userId,
      critique: kritik,
      suggestion: saran,
      // updated_at: defaultValue.updated_at,
    };
    try {
      const result = await onSubmit(formData as Krisar);
      if (result.success) {
        toast.success(
          mode === "edit" ? "Successful updating!" : "Successfully send!"
        );
        if (mode === "edit") {
          // Jika mode edit, panggil onCancel untuk reset form
          onCancel?.();
        } else {
          // Jika mode create, kosongkan form
          setKritik("");
          setSaran("");
        }
      }
      console.log("Result:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleCancel = () => {
    setKritik("");
    setSaran("");
    onCancel?.();
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 md:gap-3">
        <div className="flex flex-col md:flex-row"></div>
        {/* Textarea Kritik */}
        <div className="rounded-xl  ">
          <div className="px-4">
            <h3 className="text-gray-700 text-base font-bold pb-2">Kritik</h3>
            <textarea
              className="w-full text-base text-gray-700 rounded-lg p-4 border border-gray-300 focus:outline-green-600 resize-none min-h-[150px]"
              placeholder="Tulis kritikmu di sini..."
              value={kritik}
              onChange={(e) => setKritik(e.target.value)}
            />
          </div>
        </div>

        {/* Textarea Saran */}
        <div className="rounded-xl">
          <div className="px-4">
            <h3 className="text-gray-700 text-base font-bold pb-2 ">Saran</h3>
            <textarea
              className="w-full text-base text-gray-700 rounded-lg p-4 border border-gray-300 focus:outline-green-600 resize-none min-h-[150px]"
              placeholder="Tulis saranmu di sini..."
              value={saran}
              onChange={(e) => setSaran(e.target.value)}
            />
          </div>
        </div>
        {/* Tombol Submit */}
        <div className="flex justify-end gap-6">
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`text-white bg-red-500 hover:bg-red-900 font-medium px-6 py-2 md:px-8 md:py-3 rounded-full flex items-center gap-2 shadow-md transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              } text-sm md:text-base`}
            >
              {isSubmitting ? (
                "Memproses..."
              ) : (
                <>
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Cancel</span>
                </>
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-700 hover:bg-green-900 text-white font-medium px-6 py-2 md:px-8 md:py-3 rounded-full flex items-center gap-2 shadow-md transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            } text-sm md:text-base`}
          >
            {isSubmitting ? (
              "Memproses..."
            ) : (
              <>
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span>{mode === "edit" ? "Update" : "Send"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
