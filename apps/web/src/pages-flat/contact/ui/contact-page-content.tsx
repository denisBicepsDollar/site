import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { ContactScreen } from "./contact-screen";

export function ContactPageContent() {
  return (
    <main className="w-full py-6 md:py-10">
      <ContactScreen
        title="Контакты"
        description="Ответим на вопросы по наличию, подбору растений и условиям доставки. Самовывоз в Новозыбкове, отправка по всей России Почтой России и СДЭК."
        className=""
        formSectionClassName=""
        contactInfo={[
          {
            icon: "mail",
            label: "Email",
            value: "info@zelenyeusy.ru",
          },
          {
            icon: "phone",
            label: "Телефон",
            value: "+7 (919) 292-63-24",
          },
          {
            icon: "map",
            label: "Адрес и режим работы",
            value: "Брянская обл., г. Новозыбков · Пн–Вс 10:00–20:00",
            className: "col-span-2",
          },
        ]}
      >
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Имя</Label>
            <Input id="contact-name" type="text" placeholder="Ваше имя" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="name@example.ru"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-phone">Телефон</Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Сообщение</Label>
            <Textarea
              id="contact-message"
              placeholder="Напишите, какое растение ищете или задайте вопрос..."
            />
          </div>
          <Button
            className="w-full"
            variant="accent"
            render={
              <a href="mailto:info@zelenyeusy.ru">
                Написать на info@zelenyeusy.ru
              </a>
            }
          />
        </div>
      </ContactScreen>
    </main>
  );
}
