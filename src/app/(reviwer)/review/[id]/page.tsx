import ReviewPage from "@/components/ReviewPage";
import { notFound } from "next/navigation";
import { ReviewData } from "@/types";

const ReviewDetail = ({ params }: { params: { id: string } }) => {
  const applicantData: ReviewData = {
    name: "Abel Tadesse",
    school: "Addis Ababa Institute of Technology",
    degree: "Software Engineering",
    codingProfiles: "GitHub, LeetCode, Codeforces",
    essay1: "I am passionate about solving complex problems.",
    essay2: "I want to join because I am sure it will help me to improve my problem solving skill.",
    resume: "View Resume.pdf",
  };

  if (!applicantData) notFound();

  return <ReviewPage applicant={applicantData} />;
};

export default ReviewDetail;