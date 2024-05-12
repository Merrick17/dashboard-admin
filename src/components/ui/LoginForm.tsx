"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormItem, FormMessage, Form } from "./form";
import { useAuth } from "@/hooks/auth.hooks";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  phoneNumber: z.string().length(8, {
    message: "Veuillez entrer un numéro valide."
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit comporter au moins 6 caractères."
  })
});

export function LoginForm() {
  const router = useRouter();
  const {
    data: loginData,
    mutateAsync: loginUser,
    isPending,
    isSuccess
  } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: ""
    }
  });

  const onSubmit = async (data: any) => {
    await loginUser(data);

    // Perform form submission logic here
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Your Logo Here</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="phone">Numéro Tél</Label>
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="m@example.com"
                    required
                    className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full rounded-xl shadow-xl"
              size={"lg"}
              type="submit"
            >
              Se Connecter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
