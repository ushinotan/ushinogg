import React from "react";

function Box({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border"
      }
      {...props}
    />
  );
}

function BoxHeader({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
      }
      {...props}
    />
  );
}

function BoxTitle({...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={"leading-none"}
      {...props}
    />
  );
}

function BoxDescription({...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={"text-muted-foreground"}
      {...props}
    />
  );
}

function BoxAction({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
      {...props}
    />
  );
}

function BoxContent({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={"px-6 [&:last-child]:pb-6"}
      {...props}
    />
  );
}

function BoxFooter({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={"flex items-center px-6 pb-6 [.border-t]:pt-6"}
      {...props}
    />
  );
}

export {
  Box,
  BoxHeader,
  BoxFooter,
  BoxTitle,
  BoxAction,
  BoxDescription,
  BoxContent,
};
