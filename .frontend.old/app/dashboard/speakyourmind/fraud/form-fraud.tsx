  import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader, MessageCircleWarning, RotateCcw, Send, X } from "lucide-react";
import { FraudReq, propsFormFraud } from "./types";
import { fraudSchema, FraudSchema } from "../../../validators/validate";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function FormFraud({
  onSubmit,
  isLoading = false,
  mode = "create",
  onCancel,
  defaultValue,
  refreshData,
}: propsFormFraud) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FraudSchema>({
    resolver: zodResolver(fraudSchema),
    defaultValues: defaultValue,
  });

  useEffect(() => {
    if (defaultValue) {
      reset({
        ...defaultValue,
        types: defaultValue.types || "",
      });
    } else {
      reset({ fraud_message: "", types: "" }); // Reset ke kosong saat batal edit
    }
  }, [defaultValue, reset]);

  const submitHandler = async (data: FraudSchema) => {
   const payload: FraudReq = {
    id: mode === "edit" ? defaultValue?.id! : undefined!,
    fraud_message: data.fraud_message,
    types: data.types,
  };
    await onSubmit(payload);
    if (mode === "create") {
      toast.success("Successfully reported!");
      await refreshData?.();
    } else {
      toast.success("Successfully updated the report!");
      onCancel?.();
      await refreshData?.();
    }
    reset(); // reset form setelah berhasil kirim
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4 md:gap-2"
      >
        <div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Label atau Heading */}
            <h3 className="text-2xl font-semibold w-full md:w-2/3 flex items-center gap-2 text-gray-800">
              Apa temuanmu ?{" "}
              <MessageCircleWarning className="h-6 md:w-8 md:h-10" />
            </h3>

            {/* Select Dropdown */}
            <div className="relative w-full md:w-1/3">
              <select
                {...register("types")}
                defaultValue=""
                className={`appearance-none w-full bg-gray-50 p-3 rounded-xl text-sm md:text-base border ${
                  errors.types ? "border-red-500 " : "border-gray-300"
                } focus:outline-red-600`}
                disabled={isLoading}
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                <option value="penipuan">Penipuan</option>
                <option value="pencurian">Pencurian</option>
                <option value="penyelundupan">Penyelundupan</option>
                <option value="KKN">KKN</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Error Message */}
          <div className="flex justify-end w-full pr-2">
            {errors.types && (
              <p className="text-red-500 text-sm mt-2">
                {errors.types.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <textarea
              {...register("fraud_message")}
              className={`w-full border p-2 rounded bg-gray-50  md:rounded-xl md:p-4 min-h-[150px] md:min-h-[295px] text-sm md:text-lg text-gray-700 focus:outline-red-600 resize-none ${
                errors.fraud_message ? "border-red-500" : ""
              }`}
              disabled={isLoading}
              placeholder="Tulis temuanmu di sini..."
            />
            {errors.fraud_message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fraud_message.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end w-full">
          <div className="flex justify-end w-full items-center gap-4">
            {mode === "edit" && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-900 text-white items-center font-medium px-6 py-2 md:px-8 md:py-3 rounded-full flex gap-2 shadow-md transition"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`bg-green-700 hover:bg-green-900 text-white items-center font-medium px-6 py-2 md:px-8 md:py-3 rounded-full flex gap-2 shadow-md transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } text-sm md:text-base`}
            >
              {isLoading ? (
                <span className="animate-spin">
                  <Loader className="w-4 h-4 md:w-5 md:h-5" />
                </span>
              ) : mode === "edit" ? (
                <>
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5"/> 
                <span>Update</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Report !</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
