// Redirect old /paulalorca route to the new dynamic /case/paula-lorca route
import { redirect } from "next/navigation";

export default async function LocalePaulaLorcaPage({ params }) {
  const { locale } = await params;
  redirect(`/${locale}/case/paula-lorca`);
}
