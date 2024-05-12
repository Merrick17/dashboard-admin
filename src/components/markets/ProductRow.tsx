import React, { FC, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useProducts } from "@/hooks/useProducts";
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
import { useMarkets } from "@/hooks/useMarkets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
const formSchema = z.object({
  market: z.string().min(2, {
    message: "Le nom du marché doit comporter au moins 2 caractères."
  }),
  description: z.string().min(1, {
    message: "Veuillez sélectionner un état pour le marché."
  })
});
const ProductRow: FC<{
  _id: string;
  ind: number;
  createdAt: any;
  market: any;
  description: string;
}> = ({ _id, ind, market, createdAt, description }) => {
  const { deleteProductMutation, updateProductMutation } = useProducts();
  const { marketsData } = useMarkets();
  const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      market: market._id,
      description: description
    }
  });

  const onSubmit = async (data: any) => {
    updateProductMutation.mutateAsync({ ...data, ProductId: _id });
    setIsDialogOpened(false);
    // Perform form submission logic here
  };
  return (
    <TableRow key={_id}>
      <TableCell className="font-medium">#{ind + 1}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        {market.marketName}({market.city})
      </TableCell>
      <TableCell>{moment(createdAt).format("DD/MM/YYYY")}</TableCell>
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
                <DialogTitle>Modifier Produit</DialogTitle>
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

          <Button
            size={"icon"}
            variant={"destructive"}
            className="rounded-lg"
            onClick={() => {
              deleteProductMutation.mutateAsync({
                ProductId: _id
              });
            }}
          >
            <Trash2Icon size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
