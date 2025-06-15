"use client";

import { useEffect, useState } from "react";
import { Idea, propsFormIde } from "./types";
import { ChevronDown, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FormIde({
  onSubmit,
  defaultValue,
  mode = "create",
  onCancel,
}: // Default mode is create,
propsFormIde) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [idea, setIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && defaultValue) {
      setFrom(defaultValue.from);
      setTo(defaultValue.to);
      setIdea(defaultValue.idea);
    } else if (mode === "create") {
      // Kosongkan form saat bukan mode edit
      setFrom("");
      setTo("");
      setIdea("");
    }
  }, [mode, defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !idea) {
      toast.error("All fields must be filled out!");
      setIsSubmitting(false);
      return;
    }
    if (
      from === defaultValue?.from &&
      to === defaultValue?.to &&
      idea === defaultValue?.idea
    ) {
      onCancel?.();
      toast.error("No changes!");
      // setIsSubmitting(false);
      return;
    }
    const formData: Idea = {
      // Jangan generate ID di frontend
      id: mode === "edit" && defaultValue ? defaultValue.id : undefined,
      from,
      to,
      idea,
      date: new Date().toISOString(),
      // date: `${new Date().toLocaleDateString("id-ID")} - New!`,
    };

    const result = await onSubmit(formData);
    console.log("Result:", result);
    if (result?.success) {
      toast.success(
        mode === "edit" ? "Successful updating!" : "Successfully send!"
      );
      //  // Reset form hanya untuk mode create
      //   if (mode === "create") {
      //     setFrom("");
      //     setTo("");
      //     setIdea("");
      //   }
      if (mode === "edit") {
        // Jika mode edit, reset hanya jika ada onCancel
        onCancel?.();
      } else {
        // Jika mode create, reset form
        setFrom("");
        setTo("");
        setIdea("");
      }
    }
  };

  const handleCancel = () => {
    setFrom("");
    setTo("");
    setIdea("");
    toast.error("Canceled!");
    onCancel?.(); // biar parent yang reset selectedIdea
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:flex-1 flex flex-col">
            <label className="mb-1 pl-2 md:pl-3 font-semibold text-sm md:text-base text-gray-600">
              Your name
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From who?"
              className="bg-gray-50 p-2 md:p-3 rounded-lg md:rounded-xl text-xs md:text-base text-gray-800 focus:outline-green-600"
            />
          </div>
          <div className="w-full md:flex-1 flex flex-col">
            <label className="mb-1 pl-2 md:pl-3 font-semibold text-sm md:text-base text-gray-600">
              To department
            </label>
            <div className="relative">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={`appearance-none w-full bg-gray-50 p-2 md:p-3 rounded-lg md:rounded-xl text-sm md:text-base ${
                  to === "" ? "text-gray-400" : "text-gray-600"
                } focus:outline-green-600`}
              >
                <option value="" disabled hidden>
                  Department
                </option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="operator">Operator</option>
                <option value="marketing">Marketing</option>
                <option value="hc">HC</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <textarea
          className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 min-h-[150px] md:min-h-[295px] text-sm md:text-lg text-gray-700 focus:outline-green-600 resize-none"
          placeholder="Tulis ide kreatifmu di sini..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
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
                  <span>Cancel</span>
                  <X className="w-4 h-4 md:w-5 md:h-5" />
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
                <span>{mode === "edit" ? "Update" : "Send"}</span>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 2L11 13"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
