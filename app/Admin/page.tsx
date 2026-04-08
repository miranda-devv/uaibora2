import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redireciona para a primeira aba por padrão
  redirect("/Admin/solicitacoes");
}
