"use server";

import { cookies } from "next/headers";

export async function refreshCreate(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", token);
}
export async function accessTokenCreate(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token);
}

export async function refreshDelete() {
  (await cookies()).delete("refreshToken");
}
export async function accessTokenDelete() {
  (await cookies()).delete("accessToken");
}
export async function accessIdDelete() {
  (await cookies()).delete("id");
}
export async function accessRoleDelete() {
  (await cookies()).delete("role");
}
