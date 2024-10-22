"use client";
import { useFormStatus } from "react-dom";
import { type ComponentProps, forwardRef } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

const SubmitButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, pendingText, ...props }, ref) => {
    const { pending, action } = useFormStatus();

    const isPending = pending && action === props?.formAction;

    return (
      <UIButton {...props} ref={ref} type="submit" aria-disabled={pending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 animate-spin mr-2" />
            {pendingText}
          </>
        ) : (
          children
        )}
      </UIButton>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
