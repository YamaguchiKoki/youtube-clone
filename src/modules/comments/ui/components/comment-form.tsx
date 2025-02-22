import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

export const CommentForm = ({
  videoId,
  onSuccess,
  parentId,
  variant = "comment",
  onCancel,
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();

  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast.success("Comment created successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to create comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      parentId: parentId,
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    console.log("handleSubmit is called")
    console.log(values);
    create.mutate(values);
  }

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form className="flex gap-4 group" onSubmit={form.handleSubmit(handleSubmit)}>
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/placeholder.png"}
          name={user?.username || "Anonymous"}
        />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={
                      variant === "comment" ? "Add a comment..." : "Add a reply..."
                    }
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={create.isPending}
              type="submit"
              size="sm"
            >
            {variant === "comment" ? "Comment" : "Reply"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
