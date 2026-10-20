import { NowStatus } from "@/lib/constants";

const StatusCard = () => {
  return (
    <dl className="grid gap-4 sm: grid-cols-2">
      {NowStatus.map(({ title, description }) => (
        <div
          key={title}
          className="rounded-card border border-accent/30 bg-surface-elevated p-5 sm:p-6"
        >
          <dt className="text-ui uppercase  tracking-wide text-fg-muted">{title}</dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  );
};

export default StatusCard;
