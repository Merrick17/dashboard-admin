"use client";
import {
  Dialog,
  DialogContent,
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
import { useMarkets } from "@/hooks/useMarkets";
import { useProducts } from "@/hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
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
import moment from "moment";
import ProductRow from "./ProductRow";

const formSchema = z.object({
  market: z.string().min(2, {
    message: "Le nom du marché doit comporter au moins 2 caractères."
  }),
  description: z.string().min(1, {
    message: "Veuillez sélectionner un état pour le marché."
  })
});
const ProductList = () => {
  const { marketsData } = useMarkets();
  const {
    isProductFetchingLoading,
    productData,
    createProductMutation,
    deleteProductMutation
  } = useProducts();
  const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      market: "",
      description: ""
    }
  });
  useMemo(() => {
    console.log("Data", marketsData);
  }, []);

  const onSubmit = async (data: any) => {
    console.log("Submitted form values:", data);
    createProductMutation.mutateAsync(data);
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
              <span>Ajouter nouveau Produit</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crée un nouveau Produit</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="status">Marché</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            form.setValue("market", value);
                          }}
                        >
                          <SelectTrigger className="w-full rounded-xl shadow-xl h-[44px] bg-muted/40">
                            <SelectValue placeholder="Sélectionner un Marché" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {marketsData &&
                                marketsData.marketList.map((market: any) => (
                                  <SelectItem
                                    key={market._id}
                                    value={market._id}
                                  >
                                    {market.marketName}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="marketName">
                        Decription de Produit
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="marketName"
                          placeholder="Entrez le nom de la description"
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
            <TableHead>Produit</TableHead>
            <TableHead>Marché</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isProductFetchingLoading &&
            productData &&
            productData.map((elm: any, ind: number) => (
              <ProductRow {...elm} ind={ind} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
