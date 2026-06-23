"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { quoteSchema, type QuoteValues } from "@/lib/validations";
import { api } from "@/lib/services";
import * as React from "react";

/**
 * Único componente interativo ("use client") do mídia kit público — abre um
 * modal de "Solicitar Orçamento". O restante da página é Server Component.
 */
export function RequestQuoteButton({
  username,
  brandColor,
  contactEmail
}: {
  username: string;
  brandColor: string;
  contactEmail: string;
}) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<QuoteValues>({ resolver: zodResolver(quoteSchema) });

  async function onSubmit(values: QuoteValues) {
    await api.requestQuote(username, values);
    toast({
      variant: "success",
      title: "Solicitação enviada!",
      description: `Em breve você receberá um retorno em ${contactEmail}.`
    });
    reset();
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" style={{ backgroundColor: brandColor }}>
            <Mail className="h-4 w-4" />
            Solicitar Orçamento
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Orçamento</DialogTitle>
            <DialogDescription>
              Conte sobre a campanha e o criador responderá em breve.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="q-name">Seu nome</Label>
              <Input id="q-name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-brand">Marca / Empresa</Label>
              <Input id="q-brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-email">E-mail</Label>
              <Input id="q-email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-message">Mensagem</Label>
              <Textarea id="q-message" rows={4} {...register("message")} />
              {errors.message && (
                <p className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Enviar solicitação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
