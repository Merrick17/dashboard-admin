import React, { FC, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { tunisianStates } from "@/app/constants/stateList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMarkets } from "@/hooks/useMarkets";
import { z } from "zod";
const formSchema = z.object({
  marketName: z.string().min(2, {
    message: "Le nom du marché doit comporter au moins 2 caractères."
  }),
  state: z.string().min(1, {
    message: "Veuillez sélectionner un état pour le marché."
  }),
  city: z.string().min(2, {
    message: "Le nom de la ville doit comporter au moins 2 caractères."
  })
});
const MarketRow: FC<{
  ind: number;
  _id: string;
  marketName: string;
  state: string;
  city: string;
}> = ({ ind, marketName, state, city, _id }) => {
  const {
    isMarketFetchingLoading,
    marketsData,
    updateMarketMutation,
    deleteMarketMutation
  } = useMarkets();
  const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketName: marketName,
      state: state,
      city: city
    }
  });

  const onSubmit = async (data: any) => {
    console.log("Submitted form values:", data);
    updateMarketMutation.mutateAsync({ ...data, marketId: _id });
    setIsDialogOpened(false);
    // Perform form submission logic here
  };
  return (
    <TableRow key={_id}>
      <TableCell className="font-medium">#{ind + 1}</TableCell>
      <TableCell>{marketName}</TableCell>
      <TableCell>{state}</TableCell>
      <TableCell>{city}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-center items-center gap-2">
          <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
            <DialogTrigger>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="rounded-lg"
              >
                {" "}
                <Edit2Icon size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier marché</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="marketName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="marketName">
                          Nom de Marché
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="marketName"
                            placeholder="Entrez le nom du marché"
                            className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="status">État</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              form.setValue("state", value);
                            }}
                          >
                            <SelectTrigger className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40">
                              <SelectValue placeholder="Sélectionner un état" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {tunisianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="city">Ville</FormLabel>
                        <FormControl>
                          <Input
                            id="city"
                            placeholder="Entrez la ville"
                            className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-end items-center">
                    <Button type="submit" size={"lg"} className="rounded-xl">
                      Confirmer
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button
            size={"icon"}
            variant={"destructive"}
            className="rounded-lg"
            onClick={() => {
              deleteMarketMutation.mutateAsync({ marketId: _id });
            }}
          >
            <Trash2Icon size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MarketRow;
