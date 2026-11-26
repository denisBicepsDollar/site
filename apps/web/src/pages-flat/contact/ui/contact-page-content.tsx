import { Button } from "@site/ui/button";
import { Input } from "@site/ui/input";
import { Label } from "@site/ui/label";
import { Textarea } from "@site/ui/textarea";
import { ContactScreen } from "./contact-screen";

export function ContactPageContent() {
  return (
    <main className="relative flex size-full min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-5xl">
        <ContactScreen
          title="Get in touch"
          description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
          contactInfo={[
            {
              icon: "mail",
              label: "Email",
              value: "contact@21st.dev",
            },
            {
              icon: "phone",
              label: "Phone",
              value: "+92 312 1234567",
            },
            {
              icon: "map",
              label: "Address",
              value: "Faisalabad, Pakistan",
              className: "col-span-2",
            },
          ]}
        >
          <form action="" className="w-full space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input type="email" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Phone</Label>
              <Input type="phone" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <Textarea />
            </div>
            <Button className="w-full" type="button">
              Submit
            </Button>
          </form>
        </ContactScreen>
      </div>
    </main>
  );
}
