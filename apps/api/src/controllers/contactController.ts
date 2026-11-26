import type {Request, Response} from "express";
import db from "@/db/index";
import {contactsInMessages} from "@drizzle/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function create(req: Request, res: Response) {
  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";

  if (!message) {
    return res.status(400).json({code: "VALIDATION_ERROR", message: "Укажите сообщение"});
  }
  if (!email && !phone) {
    return res.status(400).json({code: "VALIDATION_ERROR", message: "Укажите email или телефон"});
  }
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({code: "VALIDATION_ERROR", message: "Некорректный email"});
  }

  const [contact] = await db
    .insert(contactsInMessages)
    .values({name: name || null, email: email || null, phone: phone || null, message})
    .returning({id: contactsInMessages.id, createdAt: contactsInMessages.createdAt});

  return res.status(201).json({status: "ok", data: contact});
}
