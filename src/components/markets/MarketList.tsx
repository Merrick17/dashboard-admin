"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteIcon, Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
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
import { useMarkets } from "@/hooks/useMarkets";
import { useMemo, useState } from "react";
import { tunisianStates } from "@/app/constants/stateList";
import MarketRow from "./MarketRow";

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
const MarketList = () => {
  const { isMarketFetchingLoading, marketsData, createMarketMutation } =
    useMarkets();
  const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketName: "",
      state: "Sousse",
      city: ""
    }
  });
  useMemo(() => {
    console.log("Data", marketsData);
  }, []);

  const onSubmit = async (data: any) => {
    console.log("Submitted form values:", data);
    createMarketMutation.mutateAsync(data);
    setIsDialogOpened(false);
    // Perform form submission logic here
  };
  return (
    <div className="flex flex-col w-full bg-muted/40 rounded-lg shadow-xl p-4 gap-2">
      <div className="flex w-full justify-end items-center">
        <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
          <DialogTrigger>
            {" "}
            <Button className="rounded-xl flex justify-end items-center gap-1 shadow-2xl">
              <PlusCircle />
              <span>Ajouter nouveau Marché</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crée un nouveau marché</DialogTitle>
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
                      <FormLabel htmlFor="marketName">Nom de Marché</FormLabel>
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
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Nom de Marché</TableHead>
            <TableHead>Etats</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isMarketFetchingLoading &&
            marketsData &&
            marketsData.marketList.map((elm: any, ind: number) => (
              <MarketRow {...elm} ind={ind} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketList;
