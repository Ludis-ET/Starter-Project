"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import ReviewAppClientSide from "./ReviewAppClientSide";
import { Application } from "@/types";

interface prop {
  slug : string;
  setIsReviewOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const ReviwApplication = ({ slug, setIsReviewOpen }: prop) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  // const session = await getServerSession(options);

  const accessToken = session?.accessToken;
  const [details, setDetails] = useState<Application | null>(null);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`${BASE_URL}/manager/applications/${slug}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const data = await res.json();
      setDetails(data.data.application);
    };

    getData();
  }, []);

  if (!details) {
    return <p>is Loading ...</p>;
  }

  return <ReviewAppClientSide details={details} setIsReviewOpen={setIsReviewOpen}/>;
};

export default ReviwApplication;
