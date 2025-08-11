// "use client";

// import { useForm } from "react-hook-form";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useFetchWithAuth } from "@/utils/fetchWithAuth";

// interface ApplicationFormData {
//   student_id: string;
//   school: string;
//   country: string;
//   degree: string;
//   codeforces_handle: string;
//   leetcode_handle: string;
//   github: string;
//   essay_about_you: string;
//   essay_why_a2sv: string;
//   resume: FileList;
// }

// const ApplicationForm = () => {
//   const [step, setStep] = useState(1);
//   const [submissionError, setSubmissionError] = useState<string | null>(null);
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ApplicationFormData>({
//     mode: "onBlur",
//   });

//   const totalSteps = 3;
//   const progress = (step / totalSteps) * 100;
//   const fetchWithAuth = useFetchWithAuth();

//   const onSubmit = async (data: ApplicationFormData) => {
//     setSubmissionError(null);

//     if (status !== "authenticated") {
//       setSubmissionError("You must be signed in to submit the application");
//       router.push("/signin");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("student_id", data.student_id);
//       formData.append("school", data.school);
//       formData.append("degree", data.degree);
//       formData.append("country", data.country);
//       formData.append("codeforces_handle", data.codeforces_handle || "");
//       formData.append("leetcode_handle", data.leetcode_handle || "");
//       formData.append("github", data.github || "");
//       formData.append("essay_about_you", data.essay_about_you);
//       formData.append("essay_why_a2sv", data.essay_why_a2sv);
//       if (data.resume[0]) {
//         formData.append("resume", data.resume[0]);
//       }

//       const response = await fetchWithAuth(
//         `${process.env.NEXT_PUBLIC_API_URL}/applications`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const result = await response.json();
//       // console.log(result)
//       console.log("Validation details:", result.details?.errors);

//       if (response.ok && result.success) {
//         router.push("/applicant");
//       } else {
//         throw new Error(
//           response.status === 401
//             ? "Unauthorized: Invalid or expired token"
//             : response.status === 403
//             ? "Forbidden: You do not have permission to submit this application"
//             : result.message ||
//               `Submission failed with status ${response.status}`
//         );
//       }
//     } catch (error: any) {
//       console.error("Submission error:", error);
//       setSubmissionError(
//         error.message || "An error occurred while submitting the application"
//       );
//     }
//   };

//   const handleNext = () => {
//     if (step < totalSteps) {
//       setStep(step + 1);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-baseline justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         {/* Form Title */}
//         <div>
//           <h2 className="text-center text-3xl font-bold text-gray-900">
//             Application Form
//           </h2>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-2.5">
//           <div
//             className="bg-blue-600 h-2.5 rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>

//         {/* Step Labels */}
//         <div className="flex justify-between text-sm font-medium text-gray-700">
//           <span className={step === 1 ? "text-blue-600" : ""}>
//             1. Personal Info
//           </span>
//           <span className={step === 2 ? "text-blue-600" : ""}>
//             2. Coding Profiles
//           </span>
//           <span className={step === 3 ? "text-blue-600" : ""}>
//             3. Essays & Resume
//           </span>
//         </div>

//         {/* Submission Error */}
//         {submissionError && (
//           <div className="text-center text-sm text-red-600">
//             {submissionError}
//           </div>
//         )}

//         {/* Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           {/* Step 1: Personal Info */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="student_id"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Student ID
//                 </label>
//                 <input
//                   id="student_id"
//                   type="text"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.student_id ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Student ID or Application ID"
//                   {...register("student_id", {
//                     required: "Student ID is required",
//                   })}
//                 />
//                 {errors.student_id && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.student_id.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="school"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   School
//                 </label>
//                 <input
//                   id="school"
//                   type="text"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.school ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Your School"
//                   {...register("school", {
//                     required: "School is required",
//                   })}
//                 />
//                 {errors.school && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.school.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="degree"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   degree
//                 </label>
//                 <input
//                   id="degree"
//                   type="text"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.degree ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="e.g., B.S. Computer Science"
//                   {...register("degree", {
//                     required: "degree is required",
//                   })}
//                 />
//                 {errors.degree && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.degree.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label
//                   htmlFor="country"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   country
//                 </label>
//                 <input
//                   id="country"
//                   type="text"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.country ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="e.g., B.S. Computer Science"
//                   {...register("country", {
//                     required: "country is required",
//                   })}
//                 />
//                 {errors.country && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.country.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2: Coding Profiles */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="codeforces_handle"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Codeforces Profile (Optional)
//                 </label>
//                 <input
//                   id="codeforces_handle"
//                   type="url"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.codeforces_handle
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="https://codeforces.com/profile/username"
//                   {...register("codeforces_handle", {
//                     // pattern: {
//                     //   value: /^https?:\/\/(www\.)?codeforces\.com\/profile\/.+$/,
//                     //   message: 'Invalid Codeforces URL',
//                     // },
//                   })}
//                 />
//                 {errors.codeforces_handle && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.codeforces_handle.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="leetcode_handle"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   LeetCode Profile (Optional)
//                 </label>
//                 <input
//                   id="leetcode_handle"
//                   type="url"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.leetcode_handle
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="https://leetcode.com/username"
//                   {...register("leetcode_handle", {
//                     // pattern: {
//                     //   value: /^https?:\/\/(www\.)?leetcode\.com\/.+$/,
//                     //   message: 'Invalid LeetCode URL',
//                     // },
//                   })}
//                 />
//                 {errors.leetcode_handle && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.leetcode_handle.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="github"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   GitHub Profile (Optional)
//                 </label>
//                 <input
//                   id="github"
//                   type="url"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.github ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="https://github.com/username"
//                   {...register("github", {
//                     // pattern: {
//                     //   value: /^https?:\/\/(www\.)?github\.com\/.+$/,
//                     //   message: 'Invalid GitHub URL',
//                     // },
//                   })}
//                 />
//                 {errors.github && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.github.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Essays & Resume */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="essay_about_you"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Tell About Yourself
//                 </label>
//                 <textarea
//                   id="essay_about_you"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.essay_about_you
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Describe yourself, your interests, and background"
//                   rows={4}
//                   {...register("essay_about_you", {
//                     required: "This field is required",
//                     minLength: {
//                       value: 50,
//                       message: "Must be at least 50 characters",
//                     },
//                   })}
//                 />
//                 {errors.essay_about_you && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.essay_about_you.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="essay_why_a2sv"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Why Do You Want to Join Us?
//                 </label>
//                 <textarea
//                   id="essay_why_a2sv"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.essay_why_a2sv ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Explain your motivation for joining us"
//                   rows={4}
//                   {...register("essay_why_a2sv", {
//                     required: "This field is required",
//                     minLength: {
//                       value: 50,
//                       message: "Must be at least 50 characters",
//                     },
//                   })}
//                 />
//                 {errors.essay_why_a2sv && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.essay_why_a2sv.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="resume"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Upload Resume (PDF only)
//                 </label>
//                 <input
//                   id="resume"
//                   type="file"
//                   accept="application/pdf"
//                   className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.resume ? "border-red-500" : "border-gray-300"
//                   }`}
//                   {...register("resume", {
//                     required: "Resume is required",
//                     validate: {
//                       isPDF: (files) =>
//                         files[0]?.type === "application/pdf" ||
//                         "Only PDF files are allowed",
//                       maxSize: (files) =>
//                         files[0]?.size <= 5 * 1024 * 1024 ||
//                         "File size must be less than 5MB",
//                     },
//                   })}
//                 />
//                 {errors.resume && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.resume.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={handleBack}
//               disabled={step === 1}
//               className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-700 ${
//                 step === 1
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               }`}
//             >
//               Back
//             </button>
//             {step < totalSteps ? (
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={isSubmitting || status !== "authenticated"}
//                 className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//                   isSubmitting || status !== "authenticated"
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 }`}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Application"}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationForm;

"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";

interface ApplicationFormData {
  student_id: string;
  school: string;
  country: string;
  degree: string;
  codeforces_handle: string;
  leetcode_handle: string;
  github: string;
  essay_about_you: string;
  essay_why_a2sv: string;
  resume: FileList;
}

const ApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    mode: "onBlur",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const fetchWithAuth = useFetchWithAuth();

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmissionError(null);

    if (status !== "authenticated") {
      setSubmissionError("You must be signed in to submit the application");
      router.push("/signin");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("student_id", data.student_id);
      formData.append("school", data.school);
      formData.append("degree", data.degree);
      formData.append("country", data.country);
      formData.append("codeforces_handle", data.codeforces_handle || "");
      formData.append("leetcode_handle", data.leetcode_handle || "");
      formData.append("github", data.github || "");
      formData.append("essay_about_you", data.essay_about_you);
      formData.append("essay_why_a2sv", data.essay_why_a2sv);
      if (data.resume[0]) {
        formData.append("resume", data.resume[0]);
      }

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Server response:", { status: response.status, result });

      if (response.ok && result.success) {
        router.push("/applicant");
      } else {
        console.log("Validation details:", result.details?.errors);
        throw new Error(
          response.status === 401
            ? "Unauthorized: Invalid or expired token"
            : response.status === 403
            ? "Forbidden: You do not have permission to submit this application"
            : result.message ||
              result.error ||
              `Submission failed with status ${response.status}`
        );
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmissionError(
        error.message || "An error occurred while submitting the application"
      );
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-baseline justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Application Form
          </h2>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span className={step === 1 ? "text-blue-600" : ""}>
            1. Personal Info
          </span>
          <span className={step === 2 ? "text-blue-600" : ""}>
            2. Coding Profiles
          </span>
          <span className={step === 3 ? "text-blue-600" : ""}>
            3. Essays & Resume
          </span>
        </div>
        {submissionError && (
          <div className="text-center text-sm text-red-600">
            {submissionError}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="student_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student ID
                </label>
                <input
                  id="student_id"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.student_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Student ID or Application ID"
                  {...register("student_id", {
                    required: "Student ID is required",
                  })}
                />
                {errors.student_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.student_id.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="school"
                  className="block text-sm font-medium text-gray-700"
                >
                  School
                </label>
                <input
                  id="school"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.school ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your School"
                  {...register("school", {
                    required: "School is required",
                  })}
                />
                {errors.school && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.school.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700"
                >
                  Degree
                </label>
                <input
                  id="degree"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.degree ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., B.S. Computer Science"
                  {...register("degree", {
                    required: "Degree is required",
                  })}
                />
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.degree.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="codeforces_handle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Codeforces Profile
                </label>
                <input
                  id="codeforces_handle"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.codeforces_handle
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="https://codeforces.com/profile/username"
                  {...register("codeforces_handle", {
                    required: "Codeforce link is required",
                    pattern: {
                      value:
                        /^https?:\/\/(www\.)?codeforces\.com\/profile\/[a-zA-Z0-9_-]+$/,
                      message:
                        "Must be a valid Codeforces profile URL (e.g., https://codeforces.com/profile/username)",
                    },
                  })}
                />
                {errors.codeforces_handle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.codeforces_handle.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="leetcode_handle"
                  className="block text-sm font-medium text-gray-700"
                >
                  LeetCode Profile
                </label>
                <input
                  id="leetcode_handle"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.leetcode_handle
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="https://leetcode.com/username"
                  {...register("leetcode_handle", {
                    required: "Leetcode link is required",
                    pattern: {
                      value:
                        /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/,
                      message:
                        "Must be a valid LeetCode profile URL (e.g., https://leetcode.com/username or https://leetcode.com/u/username)",
                    },
                  })}
                />
                {errors.leetcode_handle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.leetcode_handle.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub Profile
                </label>
                <input
                  id="github"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.github ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://github.com/username"
                  {...(register("github"),
                  {
                    required: "Github link is required",
                    pattern: {
                      value:
                        /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
                      message:
                        "Must be a valid GitHub profile URL (e.g., https://github.com/username)",
                    },
                  })}
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.github.message}
                  </p>
                )}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="essay_about_you"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tell About Yourself
                </label>
                <textarea
                  id="essay_about_you"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.essay_about_you
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Describe yourself, your interests, and background"
                  rows={4}
                  {...register("essay_about_you", {
                    required: "This field is required",
                    minLength: {
                      value: 50,
                      message: "Must be at least 50 characters",
                    },
                  })}
                />
                {errors.essay_about_you && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.essay_about_you.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="essay_why_a2sv"
                  className="block text-sm font-medium text-gray-700"
                >
                  Why Do You Want to Join Us?
                </label>
                <textarea
                  id="essay_why_a2sv"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.essay_why_a2sv ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Explain your motivation for joining us"
                  rows={4}
                  {...register("essay_why_a2sv", {
                    required: "This field is required",
                    minLength: {
                      value: 50,
                      message: "Must be at least 50 characters",
                    },
                  })}
                />
                {errors.essay_why_a2sv && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.essay_why_a2sv.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Resume (PDF only)
                </label>
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.resume ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("resume", {
                    required: "Resume is required",
                    validate: {
                      isPDF: (files) =>
                        files[0]?.type === "application/pdf" ||
                        "Only PDF files are allowed",
                      maxSize: (files) =>
                        files[0]?.size <= 5 * 1024 * 1024 ||
                        "File size must be less than 5MB",
                    },
                  })}
                />
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.resume.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-700 ${
                step === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              Back
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || status !== "authenticated"}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || status !== "authenticated"
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
