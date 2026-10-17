"use client";
import PitchList from "@/app/components/pitch-list/pitch-list";
import { PitchFull } from "@/app/services/pitches";
import { useEffect, useState } from "react";

export default function PitchesPage() {
  const [data, setData] = useState<PitchFull[]>([]);

  const fetchData = async () => {
    const response = await fetch(`/api/pitches/all`);

    if (response.ok) {
      const pitches = await response.json();
      setData(pitches);
    }
  };

  useEffect(() => {
    (() => {
      fetchData();
    })();
  }, []);

  return <PitchList data={data} />;
}
