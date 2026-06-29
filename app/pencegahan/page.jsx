import { redirect } from "next/navigation";

export const metadata = {
  title: "Pencegahan Stunting",
};

export default function PencegahanPage() {
  redirect("/penyebab");
}
