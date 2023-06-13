import { Metadata } from "next";
import { Keynoters } from "components/keynoters";

export const metadata: Metadata = {
  title: "Sessions",
};

export default async function KeynotersPage() {
  return (
    <>
      {/* @ts-expect-error */}
      <Keynoters />
      <div className="h-12"></div>
    </>
  );
}
