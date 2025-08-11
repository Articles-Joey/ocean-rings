import { Suspense } from "react";
import PageContent from "./PageContent"

export const metadata = {
  title: "Ocean Rings",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Play() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
