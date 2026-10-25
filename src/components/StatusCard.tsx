import { NowStatus } from "@/lib/constants";

const StatusCard = () => {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {NowStatus.map(({ title, description }) => (
        <div
          key={title}
          className="rounded-card border border-accent/30 bg-surface-elevated/60 p-3 sm:p-6"
        >
          <dt className="text-ui text-accent/60 uppercase  tracking-wide">{title}</dt>
          <dd className="text-body">{description}</dd>
        </div>
      ))}
    </dl>
  );
};

export default StatusCard;
