import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { success: false, message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, message: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar o usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil: "COMUM",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso!",
      user: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar o registro." },
      { status: 500 }
    );
  }
}
